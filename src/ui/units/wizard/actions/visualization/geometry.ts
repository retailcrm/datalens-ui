import type {PointSizeConfig} from 'shared';

export const SET_POINTS_SIZE_CONFIG = Symbol('wizard/visualization/SET_POINTS_SIZE_CONFIG');

export interface SetGeopointsConfigAction {
    type: typeof SET_POINTS_SIZE_CONFIG;
    geopointsConfig: PointSizeConfig;
}

export function setPointsSizeConfig({
    geopointsConfig,
}: {
    geopointsConfig: PointSizeConfig;
}): SetGeopointsConfigAction {
    return {
        type: SET_POINTS_SIZE_CONFIG,
        geopointsConfig,
    };
}
