# Data Flows

Документ описывает сквозные потоки системы на уровне "как движется сценарий", а не на уровне редьюсеров и частных хелперов.

## 1. Entry -> URL -> Navigation

Главный принцип: внутри продукта URL строится от `Entry` и его типа (`scope/type/key`), а не от случайного компонента.

Опорные точки:

1. `getUIEntryRoute` строит canonical URL для `connection|dataset|dash|widget` с slug (`entryId + name`).
2. `navigateHelper.redirectUrlSwitcher` выбирает финальный URL под контекст (включая mobile-preview ветку).
3. UI-слой отдает URL в `Link/Button/href` и в `router.open/openTab`.

Практический эффект:

1. одна точка сборки ссылок уменьшает расхождение роутов;
2. переходы и deep links остаются совместимыми между страницами и контекстными меню;
3. изменения URL-правил можно концентрировать в URL-конструкторах.

## 2. Browser URL -> Route Switch -> Page Module

Маршрут обрабатывается в одном shell (`datalens/index`), затем уходит в лениво загружаемую страницу.

Опорные ветки:

1. auth/profile/settings;
2. collections/workbooks;
3. datasets/connections;
4. объединенная группа `Dash + Wizard + QL`.

Для `Dash + Wizard + QL` используется общий route-switch, где дополнительно живет lock-cleanup при смене dashboard id.

Практический эффект:

1. единая точка feature/capability-gating;
2. предсказуемая маршрутизация с fallback-редиректами;
3. меньше разрозненных entry points.

## 3. Content Creation Funnel

Основной бизнес-флоу создания контента идет из контекста коллекции/воркбука:

1. create `Connection`;
2. на основе connection create `Dataset`;
3. на основе dataset/connection create `Widget` (Wizard/QL/Editor);
4. include widget в `Dashboard`.

В коде это отражается в кнопках и диалогах, которые формируют ссылки с workbook/collection контекстом и query-параметрами.

Практический эффект:

1. пользовательский сценарий остается "сверху вниз" по data dependency;
2. снижается риск orphan-сущностей вне контекста контейнера;
3. проще объяснить права: контейнер -> entry.

## 4. Edit/Save/Publish and Lock Lifecycle

Для изменяемых entry (особенно dashboard/chart) действует схема:

1. открыть сущность в конкретной ревизии;
2. при edit-mode взять lock;
3. сохранить draft или publish;
4. при смене сущности/размонтаже удалить lock.

Lock и revision-панели интегрированы в action-panel и редакторские страницы.

Практический эффект:

1. защита от конкурирующих правок;
2. явное разделение draft/published;
3. единообразное поведение при переходах между entry.

## 5. Shared Contract Flow (UI <-> Server/BFF)

`src/shared` используется как слой контрактов:

1. типы и enum для ключевых сущностей;
2. URL/slug/entry-хелперы;
3. схемы и преобразования, разделяемые между UI и server.

Практический эффект:

1. меньше дублирования контракта между слоями;
2. проще контролировать совместимость при обновлениях upstream;
3. легче локализовать breaking changes.

## 6. Зоны риска регрессий

Наиболее чувствительные флоу для форка:

1. нормализация URL перед передачей в `href`/`openTab`;
2. переходы между `collections/workbooks` и entry-editor страницами;
3. lifecycle lock при смене dashboard/revision;
4. create-флоу c workbook/collection контекстом;
5. capability-гейт на уровне маршрутов.
