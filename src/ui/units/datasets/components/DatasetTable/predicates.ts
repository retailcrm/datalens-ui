import type {DatasetField} from 'shared';
import {DATASET_FIELD_TYPES} from 'shared';

export const isHiddenSupported = (row: DatasetField) => {
    return row.initial_data_type !== DATASET_FIELD_TYPES.UNSUPPORTED;
};
