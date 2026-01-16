import type {Field, Shared} from 'shared';

export const SET_LABELS = Symbol('wizard/visualization/SET_LABELS');
export const SET_SEGMENTS = Symbol('wizard/visualization/SET_SEGMENTS');
export const SET_TOOLTIPS = Symbol('wizard/visualization/SET_TOOLTIPS');
export const SET_VISUALIZATION = Symbol('wizard/visualization/SET_VISUALIZATION');
export const SET_VISUALIZATION_PLACEHOLDER_ITEMS = Symbol(
    'wizard/visualization/SET_VISUALIZATION_PLACEHOLDER_ITEMS',
);

export interface SetLabelsAction {
    type: typeof SET_LABELS;
    labels: Field[];
}

export function setLabels({labels}: {labels: Field[]}): SetLabelsAction {
    return {
        type: SET_LABELS,
        labels,
    };
}

export type SetSegmentsAction = {
    type: typeof SET_SEGMENTS;
    segments: Field[];
};

export function setSegments({segments}: {segments: Field[]}): SetSegmentsAction {
    return {
        type: SET_SEGMENTS,
        segments,
    };
}

export interface SetTooltipsAction {
    type: typeof SET_TOOLTIPS;
    tooltips: Field[];
}

export function setTooltips({tooltips}: {tooltips: Field[]}): SetTooltipsAction {
    return {
        type: SET_TOOLTIPS,
        tooltips,
    };
}

export interface SetVisualizationAction extends SetVisualizationArgs {
    type: typeof SET_VISUALIZATION;
}

export interface SetVisualizationArgs {
    visualization: Shared['visualization'];
    qlMode?: boolean;
}

export function _setVisualization({
    visualization,
    qlMode,
}: SetVisualizationArgs): SetVisualizationAction {
    return {
        type: SET_VISUALIZATION,
        qlMode,
        visualization,
    };
}

export interface SetVisualizationPlaceholderItemsAction {
    type: typeof SET_VISUALIZATION_PLACEHOLDER_ITEMS;
    visualization: Shared['visualization'];
    colors: Field[];
    shapes: Field[];
}

export function _setVisualizationPlaceholderItems({
    visualization,
    colors,
    shapes,
}: {
    visualization: Shared['visualization'];
    colors: Field[];
    shapes: Field[];
}): SetVisualizationPlaceholderItemsAction {
    return {
        type: SET_VISUALIZATION_PLACEHOLDER_ITEMS,
        visualization,
        colors,
        shapes,
    };
}
