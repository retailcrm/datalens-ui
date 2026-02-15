# API

Документ фиксирует API-контракт проекта на верхнем уровне: какие группы методов есть и какой тип ответа они возвращают.

Фокус: не на каждом поле, а на стабильной картине интерфейсов.

## 1. API слои в проекте

1. Server routes (`src/server/modes/opensource/routes.ts`):
   - UI/navigation routes (`/collections`, `/workbooks`, `/ql`, `/wizard`, `/:entryId`, ...).
   - Gateway proxy: `POST /gateway/:scope/:service/:action?`.
   - Private endpoint: `POST /api/private/deleteLock`.
   - Charts endpoints: `/api/run`, `/api/export`, `/api/charts/v1/charts*`, `/api/private/config`.
   - Internal workbook transfer: `/api/internal/v1/workbooks/export|import|...`.
2. Public API RPC (`src/server/components/public-api/constants/common.ts`):
   - `POST /rpc/:action`
   - версия через заголовок `x-dl-api-version` (`1` или `latest`).
3. Typed SDK schema (`src/shared/schema/*`):
   - `sdk.us`, `sdk.bi`, `sdk.mix`, `sdk.biConverter`, `sdk.metaManager`, `sdk.extensions`, `sdk.auth`.

## 2. Public API v1 (`POST /rpc/:action`)

Источник: `src/server/components/public-api/config/v1.ts`.

Группы action-ов и тип ответов:

1. Collection: `createCollection`, `getCollection`, `getCollectionContent`, `moveCollection`, `deleteCollections`, ...
   - Возвращают `Collection`, `Collection[]`, или структуру `{items, nextPageToken}`.
2. Workbook: `createWorkbook`, `getWorkbook`, `getWorkbooksList`, `moveWorkbooks`, `deleteWorkbook`, ...
   - Возвращают `Workbook`, `{workbooks: Workbook[]}`, либо list-ответы.
3. Connection: `getConnection`, `createConnection`, `updateConnection`, `deleteConnection`.
   - Возвращают `ConnectionData`, `{id}`, `{}` или delete-result.
4. Dataset: `getDataset`, `createDataset`, `updateDataset`, `deleteDataset`, `validateDataset`.
   - Возвращают `Dataset`, `{id, dataset, options}`, `Dataset+options`, validation payload.
5. Dashboard/QL/Wizard:
   - `get*` возвращает entry/widget представление.
   - `delete*` возвращает пустой успешный payload.
   - `create*`/`update*` для QL/Wizard отмечены как `rawAction` (ответ формируется charts engine).
6. Entries/Navigation:
   - `getEntriesRelations` -> массив relation entries.
   - `getEntries` -> список entries.

Ошибки Public API возвращаются envelope-формата:
`{status, code, message, requestId, details}` (`src/server/controllers/public-api/index.ts`).

## 3. SDK namespaces и возвраты

Источник методов: `src/shared/schema/*/actions`.

### 3.1 `sdk.us`

Основной доменный слой (entries, collections, workbooks, locks).

1. Entries:
   - `getEntry`, `getEntries`, `listDirectory`, `getEntryByKey`, `getEntryMeta`, `getRevisions`, `getRelations`, `getRelationsGraph`.
   - Возвраты: `GetEntryResponse`, `GetEntriesResponse`, `ListDirectoryResponse`, массивы relations/revisions/meta.
2. Entry mutations:
   - `_createEntry`, `_updateEntry`, `moveEntry`, `copyEntry`, `copyWorkbookEntry`, `copyEntriesToWorkbook`, `renameEntry`, `createFolder`, `_deleteUSEntry`.
   - Возвраты: созданный/обновленный `Entry`, массивы перемещенных/скопированных entries, delete payload.
3. Shared entries:
   - `getSharedEntryDelegation`, `createSharedEntryBinding`, `updateSharedEntryBinding`, `deleteSharedEntryBinding`, `getSharedEntryBindings`, `getSharedEntryWorkbookRelations`, `moveSharedEntry`, `moveSharedEntries`, `deleteSharedEntries`.
   - Возвраты: binding-объекты, relation списки, mutation results.
4. Collections:
   - `createCollection`, `getCollection`, `getStructureItems`, `getCollectionBreadcrumbs`, `updateCollection`, `moveCollection`, `moveCollections`, `deleteCollection`, `deleteCollections`, `getRootCollectionPermissions`.
   - Возвраты: `Collection`, `{collections: Collection[]}`, `{items, nextPageToken}`, permissions object.
5. Workbooks:
   - `createWorkbook`, `getWorkbook`, `getWorkbooksList`, `getWorkbookEntries`, `getWorkbookSharedEntries`, `updateWorkbook`, `moveWorkbook`, `moveWorkbooks`, `copyWorkbook`, `deleteWorkbook`, `deleteWorkbooks`, `migrateEntriesToWorkbookByTransfer|Copy`.
   - Возвраты: `Workbook`, `{workbooks: Workbook[]}`, `{entries, nextPageToken}`, migration results.
6. Locks/State/Operations:
   - `createLock` -> `{lockToken}`
   - `extendLock`/`deleteLock` -> lock metadata
   - `createDashState` -> `{hash}`
   - `getDashState` -> `{entryId, hash, data, createdAt}`
   - `getOperation` -> `datalensOperationSchema` (`id`, `done`, timestamps, metadata).
7. Additional:
   - Favorites (`addFavorite`, `deleteFavorite`, `renameFavorite`, `getFavorites`)
   - Presets (`getPreset`)
   - Templates (`copyTemplate` -> `{entryId, workbookId?}`)
   - Color palettes (`create|get|update|delete`)
   - Embeds (`createEmbed`, `listEmbeds`, `deleteEmbed`)
   - Tenant (`setDefaultColorPalette`)
   - User settings (`getUserSettings`, `updateUserSettings`)

### 3.2 `sdk.bi`

BI API для connections/datasets.

1. Connections:
   - `getConnectors`, `getConnectorSchema`, `getConnection`, `createConnection`, `updateConnection`, `deleteConnection`, `verifyConnection`, `verifyConnectionParams`, `getConnectionSources`, `getConnectionSourceSchema`, `getConnectionTypedQueryData`.
   - Возвраты: connector lists/schemas, `ConnectionData`, `{id}`, `{}`, source/schema payloads.
2. Datasets:
   - `getDatasetByVersion`, `createDataset`, `updateDataset`, `deleteDataset`, `validateDataset`, `validateDatasetFormula`, `getPreview`, `getSources`, `getDbNames`, `getSourceListingOptions`, `getFieldTypes`, `getDataSetFieldsById`, `copyDataset`, `getDistinctsApiV2`, `getPublicDistinctsApiV2`, `checkDatasetsForPublication`, `checkConnectionsForPublication`.
   - Возвраты: `Dataset`, `{id, dataset, options}`, validation payloads, preview/distincts payloads, справочники полей/источников.
3. OAuth:
   - `getOAuthUri`, `getOAuthToken`.
   - Возвраты: URI/token payload.

### 3.3 `sdk.mix`

Агрегирующий слой и mixed сценарии.

1. Navigation/entries:
   - `getNavigationList`, `getEntryRelations`, `getBatchEntriesByIds`, `getEntriesInFolder`, `resolveEntryByLink`, `getEnrichedLinksTree`, `getPublicationPreview`, `switchPublicationStatus`, `deleteEntry`, `getEntryMetaStatus`.
   - Возвраты: navigation list, relation arrays, link resolution `{entry, params}`, publication preview, status-коды.
2. Markdown:
   - `renderMarkdown`, `batchRenderMarkdown`.
   - Возвраты: HTML render output.
3. Dash/editor:
   - `getDashboardV1`, `createDashboardV1`, `updateDashboardV1`, `deleteDashboard`, `createEditorChart`, `updateEditorChart`.
   - Возвраты: dashboard/editor entry payload.
4. Telemetry/helpers:
   - `collectDashStats` -> `{status:'success'}`
   - `collectChartkitStats` -> `{status:'success', rowsCount}`
   - `getEntriesDatasetsFields`, `getWidgetsDatasetsFields` -> агрегированные dataset-fields структуры.
5. QL/Wizard:
   - `__getQLChart__`, `__createQLChart__`, `__updateQLChart__`, `deleteQLChart`
   - `__getWizardChart__`, `__createWizardChart__`, `__updateWizardChart__`, `deleteWizardChart`
   - Возвраты: для `get*` entry payload, для delete/create/update обычно success/empty payload (или raw response charts engine).

### 3.4 `sdk.biConverter`

Импорт/обработка файлов и cloud-doc источников.

1. `getFileStatus` -> статус файла + ошибки.
2. `getFileSources` -> источники файла.
3. `getFileSourceStatus` -> статус конкретного source.
4. `updateFileSource` -> source + schema/preview/options.
5. `applySourceSettings` -> `{}`.
6. `addGoogleSheet`/`addYandexDocument` -> `{file_id, title}`.
7. `updateS3BasedConnectionData` -> `{files:[...]}`.
8. `getPresignedUrl` -> `{url, fields}`.
9. `downloadPresignedUrl` -> `{file_id, filename}`.

### 3.5 `sdk.metaManager`

Export/import long-running процессы workbook.

1. `startWorkbookExport` -> `{exportId}`
2. `getWorkbookExportStatus` -> `{exportId, status, progress, notifications?}`
3. `getWorkbookExportResult` -> `{exportId, status, data:{export, hash}}`
4. `cancelWorkbookExport` -> `{exportId}`
5. `startWorkbookImport` -> `{importId, workbookId}`
6. `getWorkbookImportStatus` -> `{importId, workbookId, status, progress, notifications}`

### 3.6 `sdk.extensions`

IAM/access bindings extension (в этой кодовой базе — заглушечный/адаптерный слой).

1. `listCollectionAccessBindings`, `listWorkbookAccessBindings`, `listSharedEntryAccessBindings` -> списки binding-ов.
2. `updateCollectionAccessBindings`, `updateWorkbookAccessBindings`, `updateSharedEntryAccessBindings` -> `GetDatalensOperationResponse`.
3. `getClaims` -> `{subjectDetails: []}`.
4. `batchListMembers` -> `{members: [], nextPageToken}`.

### 3.7 `sdk.auth`

Пользовательский management API:

1. Users CRUD/profile: `createUser`, `deleteUser`, `getUserProfile`, `getMyUserProfile`, `updateUserProfile`, `updateMyUserProfile`.
2. Passwords: `updateUserPassword`, `updateMyUserPassword`.
3. Roles: `addUsersRoles`, `updateUsersRoles`, `removeUsersRoles`.
4. Search/list: `getUsersList`, `getUsersByIds`.

Типы возвратов: `GetUserProfileResponse`, `GetUsersListResponse`, `GetUsersByIdsResponse`, либо `SuccessResponse`.

### 3.8 `sdk.charts` (использование в UI)

В UI напрямую используются:

1. `createDash` -> возвращает dashboard entry (используется `entryId`, `key/name`).
2. `createWidget` -> возвращает widget entry.
3. `readDash`/`updateDash` используются в store actions для чтения/сохранения dashboard.

## 4. Где смотреть точные контракты

1. Action definitions: `src/shared/schema/*/actions/*`
2. Response/args types: `src/shared/schema/*/types/*`
3. Public API action map: `src/server/components/public-api/config/v1.ts`
4. Route surface: `src/server/modes/opensource/routes.ts`
