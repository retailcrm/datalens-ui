import {i18n} from 'i18n';
import _ from 'lodash';
import moment from 'moment';
import {createSelector} from 'reselect';
import {QLChartType} from 'shared';
import type {QlConfig} from 'shared/types/config/ql';
import {QlConfigVersions} from 'shared/types/ql/versions';
import type {DatalensGlobalState} from 'ui';
import {DL} from 'ui/constants';
import {selectPointSizeConfig} from 'units/wizard/selectors/visualization';

import {AppStatus, ConnectionStatus, DEFAULT_SALT, VisualizationStatus} from '../../constants';
import {isPromQlQueriesEmpty, isQLQueryEmpty} from '../../utils/query';
import {
    ADD_PARAM,
    ADD_PARAM_IN_QUERY,
    ADD_QUERY,
    DRAW_PREVIEW,
    DUPLICATE_QUERY,
    REMOVE_PARAM,
    REMOVE_PARAM_IN_QUERY,
    REMOVE_QUERY,
    SET_CHART_TYPE,
    SET_COLUMNS_ORDER,
    SET_CONNECTION,
    SET_CONNECTION_SOURCES,
    SET_CONNECTION_SOURCE_SCHEMA,
    SET_CONNECTION_STATUS,
    SET_DEFAULT_PATH,
    SET_DESCRIPTION,
    SET_ENTRY,
    SET_ENTRY_KEY,
    SET_ERROR,
    SET_EXTRA_SETTINGS,
    SET_QUERY_METADATA,
    SET_QUERY_VALUE,
    SET_SETTINGS,
    SET_STATUS,
    SET_TABLE_PREVIEW_DATA,
    SET_VISUALIZATION_STATUS,
    TOGGLE_TABLE_PREVIEW,
    UPDATE_PARAM,
    UPDATE_PARAM_IN_QUERY,
    UPDATE_QUERY,
} from '../actions/ql';
import {
    getChartType,
    getConnection,
    getConnectionSources,
    getConnectionStatus,
    getEntry,
    getExtraSettings,
    getGridSchemes,
    getOrder,
    getPlaceholdersContent,
    getPreviewData,
    getQueries,
    getQueryValue,
    getValid,
    getVisualization,
} from '../selectors/ql';
import type {
    QLAction,
    QLActionAddParamInQuery,
    QLActionDrawPreview,
    QLActionRemoveParam,
    QLActionRemoveParamInQuery,
    QLActionRemoveQuery,
    QLActionSetChartType,
    QLActionSetColumnsOrder,
    QLActionSetConnection,
    QLActionSetConnectionSourceSchema,
    QLActionSetConnectionSources,
    QLActionSetConnectionStatus,
    QLActionSetDefaultPath,
    QLActionSetEntry,
    QLActionSetEntryKey,
    QLActionSetError,
    QLActionSetExtraSettings,
    QLActionSetQueryMetadata,
    QLActionSetQueryValue,
    QLActionSetSettings,
    QLActionSetStatus,
    QLActionSetTablePreviewData,
    QLActionSetVisualizationStatus,
    QLActionUpdateParam,
    QLActionUpdateParamInQuery,
    QLActionUpdateQuery,
    QLState,
} from '../typings/ql';
import {Helper} from '../utils/grid';

const initialState: QLState = {
    chartType: null,
    appStatus: AppStatus.Loading,
    defaultPath: DL.USER_LOGIN ? DL.USER_FOLDER : '/',
    visualizationStatus: VisualizationStatus.Empty,
    connectionStatus: ConnectionStatus.Empty,
    extraSettings: {},
    tablePreviewVisible: true,
    error: null,
    settings: {
        counter: 0,
        salt: DEFAULT_SALT,
    },
    entry: null,
    metadata: {
        order: null,
    },
    tablePreviewData: {},
    order: null,
    params: [],
    connection: null,
    connectionSources: [],
    connectionSourcesSchemas: {},
    chart: null,
    visualization: null,
    grid: {
        panes: [],
        scheme: '',
    },
    panes: {
        allIds: [],
        byId: {},
    },
    tabs: {
        byId: {},
        allIds: [],
    },
    queryValue: '',
    queries: [],
    paneViews: Helper.createPaneViewsData(),
    annotation: null,
};

/* --- SELECTORS --- */

export {getChartType};
export {getConnection};
export {getConnectionSources};
export {getConnectionStatus};

export const getConnectionSourcesSchemas = (state: DatalensGlobalState) =>
    state.ql.connectionSourcesSchemas;

export const getAppStatus = (state: DatalensGlobalState) => state.ql.appStatus;

export const getAppError = (state: DatalensGlobalState) => state.ql.error;

export const getVisualizationStatus = (state: DatalensGlobalState) => state.ql.visualizationStatus;

export {getExtraSettings};

export const getTablePreviewVisible = (state: DatalensGlobalState) => state.ql.tablePreviewVisible;

export {getQueryValue};
export {getQueries};

export const getRedirectUrl = (state: DatalensGlobalState) => state.ql.redirectUrl;

export const getCurrentSchemeId = (state: DatalensGlobalState) => state.ql.grid.scheme;

export const getInitialDescription = (state: DatalensGlobalState) =>
    state.ql.entry?.annotation?.description ?? '';

export const getDescription = (state: DatalensGlobalState) =>
    state.ql.annotation?.description ?? '';

export const getIsDescriptionChanged = createSelector(
    [getInitialDescription, getDescription],
    (initialDescription, description) => initialDescription !== description,
);

export {getGridSchemes};

export const getGridPanesIds = (state: DatalensGlobalState) => state.ql.grid?.panes;

export {getEntry};

export const getQueryMetadata = (state: DatalensGlobalState) => state.ql.metadata;

export const getTablePreviewData = (state: DatalensGlobalState) => state.ql.tablePreviewData;

export {getOrder};

export const getChart = (state: DatalensGlobalState) => state.ql.chart;

export const getDefaultPath = (state: DatalensGlobalState) => state.ql.defaultPath;

export const getParams = (state: DatalensGlobalState) => state.ql.params;

export {getValid};
export {getVisualization};

export const getEntryIsLocked = createSelector([getEntry], (entry): boolean => {
    return Boolean(entry && entry.permissions && entry.permissions.edit === false);
});

export const getEntryNotChanged = createSelector(
    getEntry,
    getExtraSettings,
    getQueryValue,
    getQueries,
    getConnection,
    getVisualization,
    getParams,
    getChartType,
    getPlaceholdersContent,
    selectPointSizeConfig,
    getIsDescriptionChanged,
    (
        entry,
        extraSettings,
        queryValue,
        queries,
        connection,
        visualization,
        params,
        chartType,
        placeholdersContent,
        geopointsConfig,
        isDescriptionChanged,
    ): boolean => {
        if (chartType && entry && entry.data && connection && visualization) {
            const actualSharedData: QlConfig = {
                type: 'ql',
                connection: {
                    entryId: connection.entryId,
                    type: connection.type,
                    dataExportForbidden: Boolean(connection.data?.data_export_forbidden),
                },
                colors: placeholdersContent.colors || [],
                colorsConfig: placeholdersContent.colorsConfig || {},
                labels: placeholdersContent.labels || [],
                tooltips: placeholdersContent.tooltips || [],
                shapes: placeholdersContent.shapes || [],
                shapesConfig: placeholdersContent.shapesConfig || [],
                extraSettings: extraSettings || {},
                geopointsConfig: geopointsConfig || {},
                params: params.map((param) => {
                    return {
                        type: param.type,
                        name: param.name,
                        defaultValue: param.defaultValue,
                    };
                }),
                queryValue,
                queries,
                chartType,
                visualization,
                order: null,
                version: QlConfigVersions.V7,
            };

            // Removing possible functions from the structure to compare data
            const actualSharedDataWOFunctions = JSON.parse(JSON.stringify(actualSharedData));

            return (
                _.isEqual(entry.data.shared, actualSharedDataWOFunctions) && !isDescriptionChanged
            );
        } else {
            return true;
        }
    },
);

export const getIsQLQueryEmpty = createSelector(
    [getQueryValue, getQueries, getChartType],
    (queryValue, queries, chartType): boolean => {
        switch (chartType) {
            case QLChartType.Promql:
            case QLChartType.Monitoringql: {
                return isPromQlQueriesEmpty(queries);
            }
            case QLChartType.Sql:
            default:
                return isQLQueryEmpty(queryValue);
        }
    },
);

export const getEntryCanBeSaved = createSelector(
    [getValid, getEntryIsLocked, getEntryNotChanged, getIsQLQueryEmpty],
    (valid, entryIsLocked, entryNotChanged, isQueryEmpty): boolean => {
        return valid && !isQueryEmpty && !entryIsLocked && !entryNotChanged;
    },
);

export {getPreviewData};

const getPaneCurrentTabId = (state: DatalensGlobalState, props: {paneId: string}) => {
    return state.ql.panes.byId[props.paneId].currentTab;
};

const getTabsAllIds = (state: DatalensGlobalState) => state.ql.tabs.allIds;

const getTabsById = (state: DatalensGlobalState) => state.ql.tabs.byId;

export const getTabsData = createSelector([getTabsAllIds, getTabsById], (tabsIds, tabsById) => {
    return tabsIds.map((id: string) => tabsById[id]);
});

export const makeGetPaneTabs = (state: DatalensGlobalState, props: {paneId: string}) =>
    createSelector(
        [getTabsAllIds, getTabsById, (_state) => getPaneCurrentTabId(_state, props)],
        (tabsIds, tabsById, currentTabId) => {
            return currentTabId === null ? [] : tabsIds.map((id: string) => tabsById[id]);
        },
    )(state);

export const makeGetPaneTabData = (state: DatalensGlobalState, props: {paneId: string}) =>
    createSelector(
        [getTabsById, (_state) => getPaneCurrentTabId(_state, props)],
        (tabsById, currentTabId) => {
            return currentTabId === null ? null : tabsById[currentTabId];
        },
    )(state);

const getPaneViewsById = (state: DatalensGlobalState) => state.ql.paneViews.byId;

const getPaneCurrentViewId = (state: DatalensGlobalState, props: {paneId: string}) => {
    return state.ql.panes?.byId[props.paneId].view;
};

export const makeGetPaneView = (state: DatalensGlobalState, props: {paneId: string}) =>
    createSelector(
        [getPaneViewsById, (_state) => getPaneCurrentViewId(_state, props)],
        (paneViewsById, currentViewId) => {
            return paneViewsById[currentViewId];
        },
    )(state);

export const selectInitalQlChartConfig = (state: DatalensGlobalState) =>
    state.ql.entry?.data.shared;

// eslint-disable-next-line complexity
export default function ql(state: QLState = initialState, action: QLAction) {
    switch (action.type) {
        case SET_STATUS: {
            const {appStatus} = action as QLActionSetStatus;
            return {
                ...state,
                appStatus,
            };
        }

        case SET_ERROR: {
            const {error} = action as QLActionSetError;

            return {
                ...state,
                error,
            };
        }

        case SET_SETTINGS: {
            const {
                chartType,
                tabs,
                queryValue,
                queries,
                settings,
                panes,
                grid,
                chart,
                params,
                redirectUrl,
            } = action as QLActionSetSettings;

            return {
                ...state,
                chartType,
                tabs,
                queryValue,
                queries,
                settings,
                panes,
                grid,
                chart,
                params,
                redirectUrl,
            };
        }

        case SET_DEFAULT_PATH: {
            const {newDefaultPath} = action as QLActionSetDefaultPath;

            return {
                ...state,
                defaultPath: newDefaultPath,
            };
        }

        case SET_ENTRY: {
            const {entry} = action as QLActionSetEntry;

            return {
                ...state,
                entry,
                annotation: entry?.annotation,
            };
        }

        case SET_ENTRY_KEY: {
            const {payload} = action as QLActionSetEntryKey;

            return {
                ...state,
                entry: {
                    ...state.entry,
                    key: payload,
                },
            };
        }

        case SET_EXTRA_SETTINGS: {
            const {extraSettings} = action as QLActionSetExtraSettings;

            return {
                ...state,
                extraSettings,
            };
        }

        case ADD_QUERY: {
            let {queries} = state;

            queries = [
                ...queries,
                {
                    value: '',
                    params: [],
                    queryName: `${i18n('sql', 'label_query')} ${queries.length + 1}`,
                },
            ];

            return {
                ...state,
                queries,
            };
        }

        case UPDATE_QUERY: {
            const {query, index} = action as unknown as QLActionUpdateQuery;

            const queries = [...state.queries];

            queries.splice(index, 1, query);

            return {
                ...state,
                queries,
            };
        }

        case DUPLICATE_QUERY: {
            const {index} = action as unknown as QLActionUpdateQuery;

            const queries = [...state.queries];
            const query = queries[index];

            queries.splice(index, 0, query);

            return {
                ...state,
                queries,
            };
        }

        case REMOVE_QUERY: {
            const {index} = action as unknown as QLActionRemoveQuery;

            const queries = [...state.queries];

            queries.splice(index, 1);

            return {
                ...state,
                queries,
            };
        }

        case ADD_PARAM: {
            let {params} = state;

            params = [
                ...params,
                {
                    name: '',
                    type: 'string',
                    defaultValue: '',
                },
            ];

            return {
                ...state,
                params,
            };
        }

        case UPDATE_PARAM: {
            const {param, index} = action as unknown as QLActionUpdateParam;

            const params = [...state.params];

            params.splice(index, 1, param);

            return {
                ...state,
                params,
            };
        }

        case REMOVE_PARAM: {
            const {index} = action as unknown as QLActionRemoveParam;
            const params = [...state.params];
            params.splice(index, 1);
            return {
                ...state,
                params,
            };
        }

        case ADD_PARAM_IN_QUERY: {
            const {queryIndex} = action as unknown as QLActionAddParamInQuery;

            const {queries} = state;

            const query = queries[queryIndex];

            const params = [
                ...(query.params || []),
                {
                    name: '',
                    type: 'string',
                    defaultValue: '',
                },
            ];

            const newQuery = {
                ...query,
                params,
            };

            const newQueries = [...queries];

            newQueries.splice(queryIndex, 1, newQuery);

            return {
                ...state,
                queries: newQueries,
            };
        }

        case UPDATE_PARAM_IN_QUERY: {
            const {queryIndex, paramIndex, param} = action as unknown as QLActionUpdateParamInQuery;

            const {queries} = state;

            const query = queries[queryIndex];

            const {params} = query;

            params.splice(paramIndex, 1, param);

            const newQuery = {
                ...query,
                params,
            };

            const newQueries = [...queries];

            newQueries.splice(queryIndex, 1, newQuery);

            return {
                ...state,
                queries: newQueries,
            };
        }

        case REMOVE_PARAM_IN_QUERY: {
            const {queryIndex, paramIndex} = action as unknown as QLActionRemoveParamInQuery;

            const {queries} = state;

            const query = queries[queryIndex];

            const {params} = query;

            params.splice(paramIndex, 1);

            const newQuery = {
                ...query,
                params,
            };

            const newQueries = [...queries];

            newQueries.splice(queryIndex, 1, newQuery);

            return {
                ...state,
                queries: newQueries,
            };
        }

        case SET_QUERY_METADATA: {
            const {metadata} = action as QLActionSetQueryMetadata;

            return {
                ...state,
                metadata,
            };
        }

        case SET_TABLE_PREVIEW_DATA: {
            const {tablePreviewData} = action as unknown as QLActionSetTablePreviewData;

            return {
                ...state,
                tablePreviewData,
            };
        }

        case SET_VISUALIZATION_STATUS: {
            const {visualizationStatus} = action as unknown as QLActionSetVisualizationStatus;

            return {
                ...state,
                visualizationStatus,
            };
        }

        case TOGGLE_TABLE_PREVIEW: {
            return {
                ...state,
                tablePreviewVisible: !state.tablePreviewVisible,
            };
        }

        case SET_COLUMNS_ORDER: {
            const {order} = action as QLActionSetColumnsOrder;

            return {
                ...state,
                order,
            };
        }

        case SET_CONNECTION_SOURCES: {
            const {connectionSources, connectionFreeformSources} =
                action as QLActionSetConnectionSources;

            return {
                ...state,
                connectionSources,
                connectionFreeformSources,
            };
        }

        case SET_CONNECTION_SOURCE_SCHEMA: {
            const {schema, tableName} = action as QLActionSetConnectionSourceSchema;

            const {connectionSourcesSchemas} = state;

            return {
                ...state,
                connectionSourcesSchemas: {
                    ...connectionSourcesSchemas,
                    [tableName]: schema,
                },
            };
        }

        case SET_CHART_TYPE: {
            const {chartType} = action as QLActionSetChartType;

            let params = state.params;

            const defaultFrom = moment().subtract(3, 'h').toISOString();
            const defaultTo = moment().toISOString();

            // The chart type is entered once, during initialization
            // Therefore, if necessary, we will immediately set the default parameters for each type of chart
            if (chartType === QLChartType.Promql && params.length === 0) {
                params = [
                    {
                        type: 'datetime',
                        name: 'from',
                        defaultValue: defaultFrom,
                    },
                    {type: 'datetime', name: 'to', defaultValue: defaultTo},
                    {type: 'string', name: 'step', defaultValue: '300'},
                ];
            }

            // The chart type is entered once, during initialization
            // Therefore, if necessary, we will immediately set the default parameters for each type of chart
            if (chartType === QLChartType.Monitoringql && params.length === 0) {
                params = [
                    {
                        type: 'datetime',
                        name: 'from',
                        defaultValue: defaultFrom,
                    },
                    {type: 'datetime', name: 'to', defaultValue: defaultTo},
                ];
            }

            return {
                ...state,
                chartType,
                params,
            };
        }

        case SET_CONNECTION: {
            const {connection} = action as QLActionSetConnection;
            return {
                ...state,
                connection,
            };
        }

        case SET_CONNECTION_STATUS: {
            const {connectionStatus} = action as QLActionSetConnectionStatus;
            return {
                ...state,
                connectionStatus,
            };
        }

        case SET_QUERY_VALUE: {
            const {newValue} = action as QLActionSetQueryValue;
            return {
                ...state,
                queryValue: newValue,
            };
        }

        case DRAW_PREVIEW: {
            const {entry} = state;

            if (!entry) {
                return state;
            }

            const {withoutTable = false, previewData} = action as QLActionDrawPreview;

            const updateKey = state.chart ? state.chart.updateKey + 1 : 0;

            let visualizationStatus;

            const previewDataCopy = _.cloneDeep(previewData);

            if (withoutTable) {
                visualizationStatus = VisualizationStatus.LoadingChart;
            } else {
                if (previewDataCopy !== null) {
                    previewDataCopy.preview = true;
                }

                visualizationStatus = VisualizationStatus.LoadingEverything;
            }

            return {
                ...state,
                visualizationStatus,
                chart: {
                    withoutTable,
                    preview: {
                        type: entry.type,
                        data: {
                            shared: previewDataCopy,
                        },
                        key: entry.fake ? undefined : entry.key,
                        updateKey,
                    },
                    updateKey,
                },
            };
        }

        case SET_DESCRIPTION: {
            return {
                ...state,
                annotation: {
                    description: action.payload,
                },
            };
        }
    }

    return state;
}
