import type {FilterField} from 'shared';

export const SET_FILTERS = Symbol('wizard/visualization/SET_FILTERS');

export interface SetFiltersAction {
    type: typeof SET_FILTERS;
    filters: FilterField[];
}

export function setFilters({filters}: {filters: FilterField[]}): SetFiltersAction {
    return {
        type: SET_FILTERS,
        filters,
    };
}
