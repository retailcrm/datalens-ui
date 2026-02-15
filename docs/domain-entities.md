# Domain Entities

Документ фиксирует только крупные бизнес-сущности и их отношения.

## 1. Collection

Коллекция верхнего уровня для группировки рабочих областей и контента.

- Идентификатор: `collectionId`
- Содержит: другие коллекции, рабочие книги (`Workbook`), а также привязанные shared entries

## 2. Workbook

Рабочая книга (контейнер контента внутри коллекций).

- Идентификатор: `workbookId`
- Находится в `Collection` (или в корне, если модель это допускает)
- Содержит набор `Entry`

## 3. Entry

Базовая контентная сущность в старой/унифицированной модели US.

- Идентификатор: `entryId`
- Ключевые поля: `scope`, `type`, `key`
- Основные `scope` в коде:
  - `dash`
  - `widget`
  - `dataset`
  - `connection`
  - `folder`

## 4. Dashboard

Специализация `Entry` со scope `dash`.

- Может иметь draft/published состояния
- Может содержать ссылки на widget entries
- Может иметь lock во время редактирования

## 5. Widget (Chart)

Специализация `Entry` со scope `widget`.

- Основные семейства:
  - QL
  - Wizard
  - Editor
- Рендерится в редакторских страницах и может встраиваться в Dashboard

## 6. Dataset

Специализация `Entry` со scope `dataset`.

- Описывает структуру данных для визуализаций
- Используется Widget-ами как источник

## 7. Connection

Специализация `Entry` со scope `connection`.

- Конфигурирует подключение к внешнему источнику данных
- Используется Dataset-ами и другими data flows

## 8. Permissions / Access Bindings

Модель прав присутствует минимум на уровнях:

1. `Collection`
2. `Workbook`
3. `Entry` / shared entry

Права влияют на:

1. видимость страниц и действий;
2. доступность create/edit/delete операций;
3. поведение меню и диалогов доступа.

## 9. Revisions / Lock

Сквозной механизм для изменяемых сущностей (в первую очередь dashboard/chart):

1. published/draft ревизии;
2. переключение между ревизиями;
3. lock/force-edit сценарии.

## 10. User / Tenant / Capabilities

Глобальные контекстные сущности:

1. пользователь и его настройки;
2. tenant mode / feature flags;
3. capability toggles, которые управляют доступными разделами UI.

## Отношения (верхний уровень)

1. `Collection` -> содержит -> `Collection|Workbook|SharedEntry`
2. `Workbook` -> содержит -> `Entry[*]`
3. `Dashboard` -> использует -> `Widget[*]`
4. `Widget` -> использует -> `Dataset[*]`
5. `Dataset` -> использует -> `Connection`
6. `Permissions` -> ограничивает операции -> `Collection|Workbook|Entry`
