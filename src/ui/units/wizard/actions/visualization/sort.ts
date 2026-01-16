import type {Sort} from 'shared';

export const SET_SORT = Symbol('wizard/visualization/SET_SORT');

export interface SetSortAction {
    type: typeof SET_SORT;
    sort: Sort[];
}

export function setSort({sort}: {sort: Sort[]}): SetSortAction {
    return {
        type: SET_SORT,
        sort,
    };
}
