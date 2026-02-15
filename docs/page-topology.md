# Page Topology

Верхнеуровневая карта страниц и маршрутов (без детализации внутренних вкладок).

## 1. Корневой shell

Основной роутинг собирается в `src/ui/datalens/index.tsx`.

Ключевые особенности:

1. routes зависят от capability-флагов;
2. есть отдельные ветки для auth/landing;
3. группы Dashboard/Wizard/QL объединены в общий page-switch.

## 2. Основные route-группы

## Auth and profile

1. `/auth`
2. `/profile`

## Service settings

1. `/settings`

## Collections and workbooks

1. `/collections`
2. `/collections/:collectionId`
3. `/workbooks/:workbookId`

## Connections

1. `/connections/:id`
2. `/workbooks/:workbookId/connections/new`
3. `/workbooks/:workbookId/connections/new/:type`

Отдельный standalone `/connections/new` в текущем роутинге редиректится на home.

## Datasets

1. `/datasets/:id`
2. `/workbooks/:workbookId/datasets/new`

## Preview

1. `/preview`
2. (фактически используются slug-варианты внутри preview flow)

## Wizard / QL / Dash

Маршруты собраны в `dashAndWizardQLRoutes`:

1. Wizard:
   - `/wizard`
   - `/wizard/:widgetId`
   - `/workbooks/:workbookId/wizard`
2. QL:
   - `/ql`
   - `/ql/:qlEntryId`
   - `/ql/new`
   - `/ql/new/monitoringql`
   - `/ql/new/promql`
   - `/ql/new/sql`
   - `/workbooks/:workbookId/ql`
3. Dash:
   - `/:parentDashboardId`
   - `/dashboards/new`
   - `/workbooks/:workbookId/dashboards`

## 3. Основные пользовательские переходы (путь данных)

1. Collections root -> Collection -> Workbook -> Entry
2. Workbook -> create Connection -> create Dataset -> create Widget -> add to Dashboard
3. Entry-level deep link -> открытие нужного редактора по scope/type через route resolver
4. Dashboard/Chart revisions -> переключение draft/published через query params и action panel

## 4. Навигационный принцип (по intent)

1. для внутренних переходов ожидается SPA-навигация (`router/history`);
2. для внешних ссылок допустимы нативные переходы/новые вкладки;
3. route generation строится вокруг `Entry` (`scope/type/key`) и slug-URL.
