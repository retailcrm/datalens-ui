import type {Field} from 'shared';

export const SET_DASHBOARD_PARAMETERS = Symbol('wizard/visualization/SET_DASHBOARD_PARAMETERS');

export interface SetDashboardParametersAction {
    type: typeof SET_DASHBOARD_PARAMETERS;
    dashboardParameters: Field[];
}

export function setDashboardParameters({
    dashboardParameters,
}: {
    dashboardParameters: Field[];
}): SetDashboardParametersAction {
    return {
        type: SET_DASHBOARD_PARAMETERS,
        dashboardParameters,
    };
}
