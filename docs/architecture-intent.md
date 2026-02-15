# Architecture Intent

Этот документ фиксирует не "как написано", а "что в системе, вероятно, пытались достичь".

## 1. Предполагаемый целевой замысел

## 1.1 Unified entry-centric platform

Одна базовая контентная модель (`Entry`) для разных типов сущностей:

1. dashboards;
2. widgets/charts;
3. datasets;
4. connections.

Плюс контейнерная модель (`Collection`/`Workbook`) для контента.

## 1.2 Extensible feature platform

Через `registry` и unit-level плагины система пытается поддерживать расширяемость:

1. модули (`dash`, `ql`, `wizard`, `datasets`, `connections`, `workbooks`);
2. подключаемые функции/компоненты;
3. capability-driven включение частей UI.

## 1.3 Shared contract across layers

`src/shared` выглядит как единый контракт между:

1. UI;
2. server/BFF;
3. внешними API-схемами.

Это попытка уменьшить рассинхрон типов и форматов данных.

## 1.4 One shell, many editors

Один shell приложения обслуживает разные редакторы и режимы:

1. dashboard editing/view;
2. wizard editing;
3. QL editing;
4. dataset/connection management;
5. preview/public режимы.

## 2. Где intent расходится с реализацией

Ключевые симптомы расхождения:

1. повышенная связность (циклы в UI-графе зависимостей);
2. перегруженные "god files" в крупных модулях;
3. дублирование смысловой логики между unit-ами;
4. сложный routing flow с пересекающимися сценариями;
5. локальные обходы (`eslint-disable`, `ts-ignore`) как индикатор технического долга.

## 3. Практический вектор для форка

При текущих ограничениях (upstream sync + своя product ветка) прагматичный путь:

1. не пытаться переделать всё сразу;
2. вводить guardrails (бюджеты циклов/долга, минимальные smoke checks);
3. стабилизировать самые рискованные зоны:
   - routing/navigation normalization;
   - entry actions и permissions surfaces;
   - revisions/lock flows;
   - create/save/dialog error mapping;
4. держать архитектурные документы как "каркас", а не как исчерпывающую спецификацию.
