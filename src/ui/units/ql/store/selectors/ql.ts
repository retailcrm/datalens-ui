import {createSelector} from 'reselect';
import type {QlConfig} from 'shared';
import {QlConfigVersions} from 'shared/types/ql/versions';
import type {DatalensGlobalState} from 'ui';
import {PANE_VIEWS, VisualizationStatus} from 'units/ql/constants';
import type {QLGridScheme, QLGridSchemes} from 'units/ql/store/typings/ql';
import {
    selectColors,
    selectColorsConfig,
    selectLabels,
    selectPointSizeConfig,
    selectShapes,
    selectShapesConfig,
    selectTooltips,
    selectVisualization,
} from 'units/wizard/selectors/visualization';
import {selectExtraSettings} from 'units/wizard/selectors/widget';

export const getChartType = (state: DatalensGlobalState) => state.ql?.chartType;

export const getConnection = (state: DatalensGlobalState) => state.ql.connection;
export const getConnectionSources = (state: DatalensGlobalState) => state.ql.connectionSources;
export const getConnectionStatus = (state: DatalensGlobalState) => state.ql.connectionStatus;

export const getEntry = (state: DatalensGlobalState) => state.ql.entry;
export const getExtraSettings = selectExtraSettings;

export const getParams = (state: DatalensGlobalState) => state.ql.params;

export const getPlaceholdersContent = createSelector(
    selectColors,
    selectColorsConfig,
    selectLabels,
    selectTooltips,
    selectShapes,
    selectShapesConfig,
    (colors, colorsConfig, labels, tooltips, shapes, shapesConfig) => {
        return {
            colors,
            colorsConfig,
            labels,
            tooltips,
            shapes,
            shapesConfig,
        };
    },
);

export const getValid = createSelector(
    [getEntry, getConnection, getParams],
    (entry, connection, params): boolean => {
        if (!entry) {
            return false;
        }

        if (!connection) {
            return false;
        }

        return params.every((param) => param.type && param.name);
    },
);

export const getTablePreviewVisible = (state: DatalensGlobalState) => state.ql.tablePreviewVisible;

export const getVisualization = selectVisualization;
export const getVisualizationStatus = (state: DatalensGlobalState) => state.ql.visualizationStatus;

export const getGridSchemes = createSelector(
    [getVisualizationStatus, getTablePreviewVisible],
    (visualizationStatus, tablePreviewVisible): QLGridSchemes => {
        const visualizationAndChartPreviewPane: QLGridScheme = {
            name: 'pane',
            props: {
                split: 'vertical',
                defaultSize: 240,
                minSize: 200,
                maxSize: -200,
            },
            childNodes: [
                {
                    name: 'child',
                    index: 1,
                },
                {
                    name: 'child',
                    index: 2,
                    props: {
                        loader: visualizationStatus === VisualizationStatus.LoadingChart,
                    },
                },
            ],
        };

        const tablePreviewPane: QLGridScheme = {
            name: 'child',
            index: 3,
        };

        return {
            ids: ['1-3'],
            default: '1-3',
            schemes: {
                '1-3': {
                    panes: [
                        PANE_VIEWS.MAIN,
                        PANE_VIEWS.SETTINGS,
                        PANE_VIEWS.PREVIEW,
                        PANE_VIEWS.TABLE_PREVIEW,
                    ],
                    scheme: [
                        {
                            name: 'pane',
                            props: {
                                split: 'vertical',
                                minSize: 452,
                                maxSize: -500,
                                defaultSize: '40%',
                            },
                            childNodes: [
                                {
                                    name: 'child',
                                    index: 0,
                                },
                                {
                                    name: 'pane',
                                    props: {
                                        split: 'horizontal',
                                        defaultSize: '75%',
                                        minSize: 150,
                                        maxSize: -150,
                                        pane1Style: tablePreviewVisible
                                            ? undefined
                                            : {
                                                  height: '100%',
                                              },
                                        resizerStyle: tablePreviewVisible
                                            ? undefined
                                            : {
                                                  display: 'none',
                                              },
                                        pane2Style: tablePreviewVisible
                                            ? undefined
                                            : {
                                                  display: 'none',
                                              },
                                        loader:
                                            visualizationStatus ===
                                            VisualizationStatus.LoadingEverything,
                                    },
                                    childNodes: [
                                        visualizationAndChartPreviewPane,
                                        tablePreviewPane,
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        };
    },
);

export const getOrder = (state: DatalensGlobalState) => state.ql.order;

export const getQueryValue = (state: DatalensGlobalState) => state.ql.queryValue;

export const getQueries = (state: DatalensGlobalState) => state.ql.queries;

export const selectInitalQlChartConfig = (state: DatalensGlobalState) =>
    state.ql.entry?.data.shared;

export const getPreviewData = createSelector(
    getChartType,
    getQueryValue,
    getQueries,
    getExtraSettings,
    getConnection,
    getVisualization,
    getParams,
    getPlaceholdersContent,
    getOrder,
    selectPointSizeConfig,
    (
        chartType,
        queryValue,
        queries,
        extraSettings,
        connection,
        visualization,
        params,
        placeholdersContent,
        order,
        geopointsConfig,
    ): QlConfig | null => {
        if (chartType && connection && visualization) {
            const result: QlConfig = {
                type: 'ql',
                chartType,
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
                extraSettings,
                queryValue,
                queries,
                params: params,
                visualization,
                order,
                version: QlConfigVersions.V7,
                geopointsConfig,
            };

            return result;
        } else {
            return null;
        }
    },
);
