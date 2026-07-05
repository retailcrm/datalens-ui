.DEFAULT_GOAL := help

TARGET_HEADER=@echo -e '===== \e[34m' $@ '\e[0m'
TARGET_OK=@echo -e '\e[32mOK\e[0m'
COMPOSE=docker compose
NPM=$(COMPOSE) run --rm node npm

.PHONY: .require-compose
.require-compose:
	@if ! $(COMPOSE) version >/dev/null 2>&1; then \
		echo "docker compose is unavailable"; \
		exit 1; \
	fi

.PHONY: deps
deps: .require-compose package.json package-lock.json ## [Setup][docker][heavy][network] Installs dependencies with npm ci
	$(TARGET_HEADER)
	$(NPM) ci
	$(TARGET_OK)

.PHONY: install
install: deps ## [Setup][alias] Alias for deps

.PHONY: shell
shell: .require-compose ## [General][docker] Opens a shell in the Node container
	$(TARGET_HEADER)
	$(COMPOSE) run --rm node bash

.PHONY: npm
npm: .require-compose ## [General][docker] Runs npm command; usage: make npm cmd='run build:lib'
	$(TARGET_HEADER)
	@if [ -z "$(cmd)" ]; then \
		echo "usage: make npm cmd='run <script>'"; \
		exit 1; \
	fi
	$(NPM) $(cmd)
	$(TARGET_OK)

.PHONY: dev
dev: .require-compose ## [Build][docker] Runs local dev server on port 8080
	$(TARGET_HEADER)
	$(COMPOSE) run --rm --service-ports node npm run dev

.PHONY: build
build: .require-compose ## [Build][docker][heavy] Builds application assets
	$(TARGET_HEADER)
	$(NPM) run build
	$(TARGET_OK)

.PHONY: build-lib
build-lib: .require-compose ## [Build][docker] Builds library package
	$(TARGET_HEADER)
	$(NPM) run build:lib
	$(TARGET_OK)

.PHONY: lint
lint: .require-compose ## [Tests][docker] Runs lint checks
	$(TARGET_HEADER)
	$(NPM) run lint
	$(TARGET_OK)

.PHONY: lint-fix
lint-fix: .require-compose ## [Tests][docker] Runs autofixable lint checks
	$(TARGET_HEADER)
	$(NPM) run lint:fix
	$(TARGET_OK)

.PHONY: typecheck
typecheck: .require-compose ## [Tests][docker] Runs TypeScript checks
	$(TARGET_HEADER)
	$(NPM) run typecheck
	$(TARGET_OK)

.PHONY: test-jest
test-jest: .require-compose ## [Tests][docker] Runs Jest tests; usage: make test-jest cli='--runInBand'
	$(TARGET_HEADER)
	$(NPM) run test:jest -- $(cli)
	$(TARGET_OK)

.PHONY: test-e2e
test-e2e: .require-compose ## [Tests][docker][heavy] Runs opensource Playwright tests
	$(TARGET_HEADER)
	$(NPM) run test:e2e:opensource -- $(cli)
	$(TARGET_OK)

.PHONY: compose-config
compose-config: .require-compose ## [General][docker] Validates docker-compose.yml
	$(TARGET_HEADER)
	$(COMPOSE) config
	$(TARGET_OK)

.PHONY: help
help: ## [General] Shows grouped command help
	@set -eu; \
	if [ -t 1 ] && [ -z "$${CI:-}" ] && [ -z "$${NO_COLOR:-}" ]; then \
		C_HEAD="$$(printf '\033[1;36m')"; \
		C_TGT="$$(printf '\033[36m')"; \
		C_TAG="$$(printf '\033[33m')"; \
		C_RST="$$(printf '\033[0m')"; \
	else \
		C_HEAD=''; C_TGT=''; C_TAG=''; C_RST=''; \
	fi; \
	FILTER="$$(printf '%s' "$(value filter)" | tr '[:upper:]' '[:lower:]')"; \
	awk -v filter="$$FILTER" '\
		function trim(s){ sub(/^[ \t\r\n]+/, "", s); sub(/[ \t\r\n]+$$/, "", s); return s } \
		function group_order(g){ \
			if (g=="General") return 1; \
			if (g=="Setup") return 2; \
			if (g=="Build") return 3; \
			if (g=="Tests") return 4; \
			return 99; \
		} \
		/^[a-zA-Z0-9_.-]+:.*##[[:space:]]+/ { \
			target = $$1; sub(/:.*/, "", target); \
			if (target ~ /^\./) next; \
			desc = $$0; sub(/^.*##[[:space:]]*/, "", desc); \
			group = "Other"; tags = ""; \
			if (match(desc, /^\[[^]]+\]/)) { \
				group = substr(desc, 2, RLENGTH - 2); \
				desc = substr(desc, RLENGTH + 1); \
			} \
			while (match(desc, /^[[:space:]]*\[[^]]+\]/)) { \
				sub(/^[[:space:]]*/, "", desc); \
				rb = index(desc, "]"); \
				if (rb == 0) break; \
				tags = tags "[" substr(desc, 2, rb - 2) "]"; \
				desc = substr(desc, rb + 1); \
			} \
			desc = trim(desc); \
			hay = tolower(target " " group " " tags " " desc); \
			if (filter != "" && index(hay, filter) == 0) next; \
			printf "%02d\t%s\t%s\t%s\t%s\n", group_order(group), group, target, tags, desc; \
		} \
	' $(MAKEFILE_LIST) \
	| sort -t "$$(printf '\t')" -k1,1n -k3,3 \
	| awk -F '\t' -v c_head="$$C_HEAD" -v c_tgt="$$C_TGT" -v c_tag="$$C_TAG" -v c_rst="$$C_RST" '\
		BEGIN { current = ""; count = 0 } \
		{ \
			if ($$2 != current) { \
				if (current != "") print ""; \
				printf "%s%s%s\n", c_head, $$2, c_rst; \
				current = $$2; \
			} \
			printf "  %s%-18s%s %s", c_tgt, $$3, c_rst, $$5; \
			if ($$4 != "") printf " %s%s%s", c_tag, $$4, c_rst; \
			printf "\n"; \
			count++; \
		} \
		END { if (count == 0) print "No targets matched the current filter." }'; \
	echo ""; \
	printf "%sQuick Start%s\n" "$$C_HEAD" "$$C_RST"; \
	printf "  make deps\n"; \
	printf "  make build-lib\n"; \
	printf "  make test-jest cli='--runInBand'\n"; \
	echo ""; \
	printf "%sExamples%s\n" "$$C_HEAD" "$$C_RST"; \
	printf "  make help filter=build\n"; \
	printf "  make npm cmd='run typecheck:ui'\n"
