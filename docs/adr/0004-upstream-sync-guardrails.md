# ADR-0004: Upstream Sync Guardrails With Budgets

## Status

Accepted

## Context

Форк регулярно подтягивает upstream, при этом локально развивает продукт. Без guardrails синк легко ломает стабильность в навигации, типах и dependency-графе.

## Decision

Поддерживать легковесные автоматические проверки с бюджетами:

1. madge cycles budget;
2. debt counters (`ts-ignore`, `eslint-disable`, `TODO/FIXME/HACK`);
3. typecheck/build smoke checks (`ui`, `server`, `dist-lib`).

Проверки должны быть достаточно быстрыми для регулярного запуска до и после sync.

## Consequences

1. плюсы: раннее обнаружение регрессий от upstream и более предсказуемый merge cost;
2. минусы: требуется периодическая перекалибровка бюджетов;
3. правило для форка: увеличивать бюджеты только осознанно и с фиксацией причины.
