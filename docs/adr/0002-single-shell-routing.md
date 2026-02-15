# ADR-0002: Single Shell Routing

## Status

Accepted

## Context

Приложение объединяет несколько крупных режимов (collections/workbooks, datasets/connections, dash/wizard/ql, auth/profile/settings).
Если routing разъезжается по модулям без общего центра, усложняется capability-gating и fallback-поведение.

## Decision

Считать единый datalens shell центральной точкой route orchestration с группировкой маршрутов по страницам и capability-проверкам.

## Consequences

1. плюсы: единая точка входа, понятные fallback/redirect правила, более управляемые feature flags;
2. минусы: shell может разрастаться и требует дисциплины при добавлении новых route-групп;
3. правило для форка: новые верхнеуровневые маршруты добавлять через существующую shell-группировку, не через независимые route-entry.
