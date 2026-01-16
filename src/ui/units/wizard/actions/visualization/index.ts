import type {
    Field,
    FilterField,
    HierarchyField,
    Placeholder,
    PlaceholderSettings,
    ServerTooltipConfig,
    Shared,
} from 'shared';
import {PlaceholderId, isFieldHierarchy} from 'shared';
import type {ApplyData, DatalensGlobalState} from 'ui';

import type {ColumnSettingsState} from '../../components/Dialogs/DialogColumnSettings/hooks/useDialogColumnSettingsState';
import type {WizardDispatch} from '../../reducers';
import type {SetHierarchiesAction} from '../dataset';
import {setHierarchies} from '../dataset';
import {openWizardDialogFilter} from '../dialog';
import {setVisualizationPlaceholderItems} from '../index';
import {updatePreviewAndClientChartsConfig} from '../preview';

import type {SetColorsAction, SetColorsConfigAction} from './colors';
import type {
    SetLabelsAction,
    SetSegmentsAction,
    SetTooltipsAction,
    SetVisualizationAction,
    SetVisualizationPlaceholderItemsAction,
} from './contents';
import type {SetDashboardParametersAction} from './dashboard';
import {setFilters} from './filters';
import type {SetFiltersAction} from './filters';
import type {SetGeopointsConfigAction} from './geometry';
import type {SetLayerFiltersAction, SetSelectedLayerIdAction, UpdateLayersAction} from './layers';
import type {SetShapesAction, SetShapesConfigAction} from './shapes';
import type {SetSortAction} from './sort';

export {SET_VISUALIZATION} from './contents';
export {SET_VISUALIZATION_PLACEHOLDER_ITEMS} from './contents';
export {SET_FILTERS} from './filters';
export {SET_COLORS} from './colors';
export const SET_AVAILABLE = Symbol('wizard/visualization/SET_AVAILABLE');
export const SET_Y_AXIS_CONFLICT = Symbol('wizard/visualization/SET_Y_AXIS_CONFLICT');
export const SET_DISTINCTS = Symbol('wizard/visualization/SET_DISTINCTS');
export {SET_COLORS_CONFIG} from './colors';
export {SET_POINTS_SIZE_CONFIG} from './geometry';
export {SET_SORT} from './sort';
export {SET_LABELS} from './contents';
export {SET_TOOLTIPS} from './contents';
export {SET_SELECTED_LAYER_ID} from './layers';
export {SET_LAYER_FILTERS} from './layers';
export {UPDATE_LAYERS} from './layers';
export {SET_SHAPES} from './shapes';
export {SET_SHAPES_CONFIG} from './shapes';
export {SET_DASHBOARD_PARAMETERS} from './dashboard';
export {SET_SEGMENTS} from './contents';
export const UPDATE_PLACEHOLDER_SETTINGS = Symbol(
    'wizard/visualization/UPDATE_PLACEHOLDER_SETTINGS',
);
export const SET_DRILL_DOWN_LEVEL = Symbol('wizard/SET_DRILL_DOWN_LEVEL');

export {setFilters};

export {setColors} from './colors';

interface SetAvailableAction {
    type: typeof SET_AVAILABLE;
    available: Field[];
}

export function setAvailable({available}: {available: Field[]}): SetAvailableAction {
    return {
        type: SET_AVAILABLE,
        available,
    };
}

interface SetPointConflictAction {
    type: typeof SET_Y_AXIS_CONFLICT;
    pointConflict?: boolean;
}

export function setPointConflict({
    pointConflict,
}: {
    pointConflict?: boolean;
}): SetPointConflictAction {
    return {
        type: SET_Y_AXIS_CONFLICT,
        pointConflict,
    };
}

interface SetDistinctsAction {
    type: typeof SET_DISTINCTS;
    distincts: Record<string, string[]>;
}

export function setDistincts({
    distincts,
}: {
    distincts: Record<string, string[]>;
}): SetDistinctsAction {
    return {
        type: SET_DISTINCTS,
        distincts,
    };
}

export {setColorsConfig} from './colors';
export {setPointsSizeConfig} from './geometry';
export {setSort} from './sort';
export {setLabels} from './contents';
export {setTooltips} from './contents';
export {updateLayers} from './layers';
export {setLayerFilters} from './layers';
export {setShapes} from './shapes';
export {setShapesConfig} from './shapes';
export {setDashboardParameters} from './dashboard';
export {setSegments} from './contents';

type OnFilterItemClickArgs = {
    filterItem: Field;
    onApplyCallback?: (filterItem: Field, data: ApplyData) => void;
};

export function onFilterItemClick({filterItem, onApplyCallback}: OnFilterItemClickArgs) {
    return function (dispatch: WizardDispatch, getState: () => DatalensGlobalState) {
        let filters = getState().wizard.visualization.filters as unknown as Field[];

        const onDialogFilterAction = (data?: ApplyData) => {
            if (data) {
                const result = {
                    ...filterItem,
                    filter: {
                        value: data.values,
                        operation: {code: data.operation},
                    },
                };

                if (filterItem.disabled) {
                    filters = filters.filter((filter) => {
                        return !(filter === filterItem && filter.unsaved);
                    });

                    delete filterItem.disabled;
                }

                if (filters.some((filter) => filter === filterItem)) {
                    filters = filters.map((filter) => (filter === filterItem ? result : filter));
                } else {
                    filters = [...filters, result];
                }

                if (onApplyCallback && data) {
                    onApplyCallback(filterItem, data);
                }

                dispatch(setFilters({filters: filters as unknown as FilterField[]}));
                dispatch(updatePreviewAndClientChartsConfig({}));
            }
        };

        dispatch(
            openWizardDialogFilter({
                filterItem,
                onDialogFilterApply: onDialogFilterAction,
            }),
        );
    };
}

export function updateFieldColumnSettings(
    visualization: Shared['visualization'],
    placeholder: Placeholder,
    columnsSettings: {columns: ColumnSettingsState; rows: ColumnSettingsState},
    needRedraw: boolean,
) {
    return (dispatch: WizardDispatch, getState: () => DatalensGlobalState) => {
        const hiearchiesToUpdate: HierarchyField[] = [];

        const placeholderId = placeholder.id;
        let placeholderType: 'columns' | 'rows' | undefined;

        switch (placeholderId as PlaceholderId) {
            case PlaceholderId.PivotTableColumns:
            case PlaceholderId.FlatTableColumns:
                placeholderType = 'columns';
                break;
            case PlaceholderId.PivotTableRows:
                placeholderType = 'rows';
                break;
            default:
                placeholderType = undefined;
                break;
        }

        if (!placeholderType) {
            return;
        }

        const updatedItems: Field[] = placeholder.items.map((field) => {
            const updatedColumnSettings =
                columnsSettings[placeholderType as 'columns' | 'rows'][field.guid].columnSettings;

            if (isFieldHierarchy(field)) {
                const updatedHierarchyFields = field.fields.map((innerField) => ({
                    ...innerField,
                    columnSettings: {...field.columnSettings, ...updatedColumnSettings},
                }));

                const updatedHierarchy: HierarchyField = {
                    ...field,
                    fields: updatedHierarchyFields,
                };

                hiearchiesToUpdate.push(updatedHierarchy);

                return updatedHierarchy;
            }

            return {
                ...field,
                columnSettings: {
                    ...field.columnSettings,
                    ...updatedColumnSettings,
                },
            } as Field;
        });

        if (hiearchiesToUpdate.length) {
            const prevHierarchies = getState().wizard.visualization.hierarchies;
            const newHierarchies = prevHierarchies.map((item) => {
                const hierarchyToUpdate = hiearchiesToUpdate.find((h) => h.guid === item.guid);
                return hierarchyToUpdate || item;
            });
            dispatch(setHierarchies({hierarchies: newHierarchies}));
        }

        dispatch(
            setVisualizationPlaceholderItems({
                visualization,
                placeholder,
                items: updatedItems,
            }),
        );

        dispatch(
            updatePreviewAndClientChartsConfig({
                needRedraw,
            }),
        );
    };
}

type UpdatePlaceholderSettingsAction = {
    type: typeof UPDATE_PLACEHOLDER_SETTINGS;
    settings: Partial<PlaceholderSettings>;
    placeholderId: PlaceholderId;
};

export function updatePlaceholderSettings(
    placeholderId: PlaceholderId,
    settings: Partial<PlaceholderSettings>,
): UpdatePlaceholderSettingsAction {
    return {
        type: UPDATE_PLACEHOLDER_SETTINGS,
        settings,
        placeholderId,
    };
}

type SetDrillDownLevelAction = {
    type: typeof SET_DRILL_DOWN_LEVEL;
    drillDownLevel: number;
};

export function setDrillDownLevel({
    drillDownLevel,
}: {
    drillDownLevel: number;
}): SetDrillDownLevelAction {
    return {
        type: SET_DRILL_DOWN_LEVEL,
        drillDownLevel,
    };
}

export const SET_TOOLTIP_CONFIG = Symbol('wizard/visualization/SET_TOOLTIP_CONFIG');

interface SetTooltipConfigAction {
    type: typeof SET_TOOLTIP_CONFIG;
    tooltipConfig: ServerTooltipConfig;
}

export function setTooltipConfig({
    tooltipConfig,
}: {
    tooltipConfig: ServerTooltipConfig;
}): SetTooltipConfigAction {
    return {
        type: SET_TOOLTIP_CONFIG,
        tooltipConfig,
    };
}

export type VisualizationAction =
    | SetLayerFiltersAction
    | SetSelectedLayerIdAction
    | UpdateLayersAction
    | SetTooltipsAction
    | SetLabelsAction
    | SetSortAction
    | SetGeopointsConfigAction
    | SetColorsConfigAction
    | SetColorsAction
    | SetAvailableAction
    | SetPointConflictAction
    | SetDistinctsAction
    | SetFiltersAction
    | SetVisualizationPlaceholderItemsAction
    | SetVisualizationAction
    | SetHierarchiesAction
    | SetShapesAction
    | SetShapesConfigAction
    | SetDashboardParametersAction
    | SetSegmentsAction
    | UpdatePlaceholderSettingsAction
    | SetDrillDownLevelAction
    | SetTooltipConfigAction;
