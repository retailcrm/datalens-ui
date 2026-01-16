import type {Field, TableShared} from 'shared';

export const SET_COLORS = Symbol('wizard/visualization/SET_COLORS');
export const SET_COLORS_CONFIG = Symbol('wizard/visualization/SET_COLORS_CONFIG');

export interface SetColorsAction {
    type: typeof SET_COLORS;
    colors: Field[];
}

export function setColors({colors}: {colors: Field[]}): SetColorsAction {
    return {
        type: SET_COLORS,
        colors,
    };
}

export interface SetColorsConfigAction {
    type: typeof SET_COLORS_CONFIG;
    colorsConfig: TableShared['colorsConfig'];
}

export function setColorsConfig({colorsConfig}: {colorsConfig: TableShared['colorsConfig']}) {
    return {
        type: SET_COLORS_CONFIG,
        colorsConfig,
    };
}
