import type {FilterField, VisualizationWithLayersShared} from 'shared';

export const SET_LAYER_FILTERS = Symbol('wizard/visualization/SET_LAYER_FILTERS');
export const SET_SELECTED_LAYER_ID = Symbol('wizard/visualization/SET_SELECTED_LAYER_ID');
export const UPDATE_LAYERS = Symbol('wizard/visualization/UPDATE_LAYERS');

export interface SetLayerFiltersAction {
    type: typeof SET_LAYER_FILTERS;
    filters: FilterField[];
}

export function setLayerFilters({filters}: {filters: FilterField[]}): SetLayerFiltersAction {
    return {
        type: SET_LAYER_FILTERS,
        filters,
    };
}

export interface SetSelectedLayerIdAction {
    type: typeof SET_SELECTED_LAYER_ID;
    layerId: string;
}

export function _setSelectedLayerId({layerId}: {layerId: string}): SetSelectedLayerIdAction {
    return {
        type: SET_SELECTED_LAYER_ID,
        layerId,
    };
}

export interface UpdateLayersAction {
    type: typeof UPDATE_LAYERS;
    layers: VisualizationWithLayersShared['visualization']['layers'];
}

export function updateLayers({
    layers,
}: {
    layers: VisualizationWithLayersShared['visualization']['layers'];
}): UpdateLayersAction {
    return {
        type: UPDATE_LAYERS,
        layers,
    };
}
