import type {Field, ShapesConfig} from 'shared';

export const SET_SHAPES = Symbol('wizard/visualization/SET_SHAPES');
export const SET_SHAPES_CONFIG = Symbol('wizard/visualization/SET_SHAPES_CONFIG');

export interface SetShapesAction {
    type: typeof SET_SHAPES;
    shapes: Field[];
}

export function setShapes({shapes}: {shapes: Field[]}): SetShapesAction {
    return {
        type: SET_SHAPES,
        shapes,
    };
}

export interface SetShapesConfigAction {
    type: typeof SET_SHAPES_CONFIG;
    shapesConfig: ShapesConfig;
}

export function setShapesConfig({
    shapesConfig,
}: {
    shapesConfig: ShapesConfig;
}): SetShapesConfigAction {
    return {
        type: SET_SHAPES_CONFIG,
        shapesConfig,
    };
}
