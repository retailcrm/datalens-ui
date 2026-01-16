import type {SortedDataItem} from '@gravity-ui/react-data-table';
import get from 'lodash/get';
import type {DatasetField, DatasetSourceAvatar} from 'shared';
import {FORMULA_CALC_MODE} from 'units/datasets/components/DatasetTable/constants';
import {getFieldSourceTitle} from 'units/datasets/components/DatasetTable/fields';
import {getDatasetLabelValue} from 'utils/helpers';

export const sortTitleColumn = (
    row1: SortedDataItem<DatasetField>,
    row2: SortedDataItem<DatasetField>,
) => {
    const title1 = get(row1, ['row', 'title']);
    const title2 = get(row2, ['row', 'title']);

    return title1.localeCompare(title2, undefined, {numeric: true});
};

export const sortSourceColumn = (
    row1: SortedDataItem<DatasetField>,
    row2: SortedDataItem<DatasetField>,
    avatars?: DatasetSourceAvatar[],
) => {
    const calcModeRow1 = get(row1, ['row', 'calc_mode']);
    const calcModeRow2 = get(row2, ['row', 'calc_mode']);
    const sourceRow1 = getFieldSourceTitle(get(row1, 'row'), avatars);
    const sourceRow2 = getFieldSourceTitle(get(row2, 'row'), avatars);
    let sortComparisonValue = 0;

    if (calcModeRow1 === FORMULA_CALC_MODE && calcModeRow2 !== FORMULA_CALC_MODE) {
        sortComparisonValue = 1;
    } else if (calcModeRow1 !== FORMULA_CALC_MODE && calcModeRow2 === FORMULA_CALC_MODE) {
        sortComparisonValue = -1;
    } else {
        sortComparisonValue = sourceRow2.localeCompare(sourceRow1, undefined, {
            numeric: true,
        });
    }

    return sortComparisonValue;
};

export const sortIdColumn = (
    row1: SortedDataItem<DatasetField>,
    row2: SortedDataItem<DatasetField>,
) => {
    const guid1 = get(row1, ['row', 'guid']);
    const guid2 = get(row2, ['row', 'guid']);

    return guid1.localeCompare(guid2, undefined, {numeric: true});
};

export const sortDescriptionColumn = (
    row1: SortedDataItem<DatasetField>,
    row2: SortedDataItem<DatasetField>,
) => {
    const text1 = get(row1, ['row', 'description']);
    const text2 = get(row2, ['row', 'description']);

    return text1.localeCompare(text2, undefined, {numeric: true});
};

export const sortAggregationColumn = (
    row1: SortedDataItem<DatasetField>,
    row2: SortedDataItem<DatasetField>,
) => {
    const aggregationValue1 = get(row1, ['row', 'aggregation']);
    const aggregationValue2 = get(row2, ['row', 'aggregation']);
    const text1 = getDatasetLabelValue(aggregationValue1);
    const text2 = getDatasetLabelValue(aggregationValue2);

    return text1.localeCompare(text2, undefined, {numeric: true});
};

export const sortCastColumn = (
    row1: SortedDataItem<DatasetField>,
    row2: SortedDataItem<DatasetField>,
) => {
    const castValue1 = get(row1, ['row', 'cast']);
    const castValue2 = get(row2, ['row', 'cast']);
    const text1 = getDatasetLabelValue(castValue1);
    const text2 = getDatasetLabelValue(castValue2);

    return text1.localeCompare(text2, undefined, {numeric: true});
};
