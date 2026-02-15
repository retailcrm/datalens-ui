#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BUDGETS_FILE="$ROOT_DIR/scripts/ci/upstream-sync-budgets.json"

MODE="${1:-full}"
QUICK=0

case "$MODE" in
    quick|--quick)
        QUICK=1
        ;;
    full|--full|"")
        QUICK=0
        ;;
    *)
        echo "Usage: scripts/ci/upstream-sync-checks.sh [--quick|--full]"
        exit 2
        ;;
esac

cd "$ROOT_DIR"

read_budget() {
    local key="$1"
    node -e '
const fs = require("fs");
const [file, key] = process.argv.slice(1);
const budget = JSON.parse(fs.readFileSync(file, "utf8"));
const value = key.split(".").reduce((acc, part) => (acc == null ? undefined : acc[part]), budget);
if (value === undefined) {
    console.error(`Missing budget key: ${key}`);
    process.exit(2);
}
process.stdout.write(String(value));
' "$BUDGETS_FILE" "$key"
}

count_matches() {
    local pattern="$1"
    local value
    value="$(rg -n "$pattern" src tests -S | wc -l | tr -d ' ' || true)"
    echo "${value:-0}"
}

count_madge_cycles() {
    local target="$1"
    local tsconfig="$2"
    local tmp_file
    tmp_file="$(mktemp)"

    npx --no-install madge \
        --circular \
        --json \
        --extensions ts,tsx,js,jsx \
        --ts-config "$tsconfig" \
        "$target" >"$tmp_file" || true

    if [[ ! -s "$tmp_file" ]]; then
        rm -f "$tmp_file"
        echo "0"
        return
    fi

    node -e '
const fs = require("fs");
const file = process.argv[1];
const raw = fs.readFileSync(file, "utf8").trim();
if (!raw) {
    process.stdout.write("0");
    process.exit(0);
}
const parsed = JSON.parse(raw);
const value = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
process.stdout.write(String(value));
' "$tmp_file"

    rm -f "$tmp_file"
}

FAILURES=0

assert_le() {
    local metric_name="$1"
    local actual="$2"
    local budget="$3"

    if (( actual <= budget )); then
        echo "[OK]  $metric_name: $actual <= $budget"
    else
        echo "[FAIL] $metric_name: $actual > $budget"
        FAILURES=$((FAILURES + 1))
    fi
}

echo "==> Upstream sync checks mode: $([[ $QUICK -eq 1 ]] && echo quick || echo full)"
echo "==> Step 1/3: static quality budget checks"

TS_DIRECTIVE_COUNT="$(count_matches '@ts-ignore|@ts-expect-error')"
ESLINT_DISABLE_COUNT="$(count_matches 'eslint-disable')"
TODO_FIXME_HACK_COUNT="$(count_matches '\bTODO\b|\bFIXME\b|\bHACK\b')"
UI_CYCLES="$(count_madge_cycles 'src/ui' 'src/ui/tsconfig.json')"
SERVER_CYCLES="$(count_madge_cycles 'src/server' 'src/server/tsconfig.json')"
SHARED_CYCLES="$(count_madge_cycles 'src/shared' 'tsconfig.json')"

assert_le "debt.tsDirective" "$TS_DIRECTIVE_COUNT" "$(read_budget 'debt.tsDirectiveMax')"
assert_le "debt.eslintDisable" "$ESLINT_DISABLE_COUNT" "$(read_budget 'debt.eslintDisableMax')"
assert_le "debt.todoFixmeHack" "$TODO_FIXME_HACK_COUNT" "$(read_budget 'debt.todoFixmeHackMax')"
assert_le "madge.uiCircular" "$UI_CYCLES" "$(read_budget 'madge.uiCircularMax')"
assert_le "madge.serverCircular" "$SERVER_CYCLES" "$(read_budget 'madge.serverCircularMax')"
assert_le "madge.sharedCircular" "$SHARED_CYCLES" "$(read_budget 'madge.sharedCircularMax')"

echo "==> Step 2/3: type checks"
npm run typecheck:ui

if [[ $QUICK -eq 0 ]]; then
    npm run typecheck:server
fi

echo "==> Step 3/3: build checks"
if [[ $QUICK -eq 0 ]]; then
    npm run build:lib
else
    echo "Skipped build:lib in quick mode"
fi

if (( FAILURES > 0 )); then
    echo "Upstream sync checks failed with $FAILURES budget violation(s)."
    exit 1
fi

echo "Upstream sync checks passed."
