import type {SortedDataItem} from '@gravity-ui/react-data-table';
import get from 'lodash/get';
import type {
    DATASET_FIELD_TYPES,
    DatasetField,
    DatasetFieldAggregation,
    DatasetOptionFieldItem,
    DatasetOptions,
    DatasetRls,
    DatasetSelectionMap,
    DatasetSourceAvatar,
} from 'shared';
import {Feature} from 'shared';
import type {Permissions} from 'shared/types/permissions';
import {isEnabledFeature} from 'ui/utils/isEnabledFeature';

import {
    getAggregationColumn,
    getCastColumn,
    getDescriptionColumn,
    getHiddenColumn,
    getIdColumn,
    getIndexColumn,
    getMoreColumn,
    getRlsColumn,
    getSourceColumn,
    getTitleColumn,
} from './columns';
import {getFieldSettingsColumn} from './columns/FieldSettings';
import type {FieldAction} from './constants';
import type {ColumnItem} from './types';

const WIDTH_15 = '15%';
const WIDTH_20 = '20%';

type GetColumnsArgs = {
    selectedRows: DatasetSelectionMap;
    fieldsCount: number;
    fields: DatasetOptionFieldItem[];
    showFieldsId: boolean;
    avatars?: DatasetSourceAvatar[];
    setActiveRow: ColumnItem['setActiveRow'];
    openDialogFieldEditor: (field: DatasetField) => void;
    handleTitleUpdate: (field: DatasetField, value: string) => void;
    handleIdUpdate: (field: DatasetField, value: string) => void;
    handleHiddenUpdate: (field: DatasetField) => void;
    handleUpdateFieldSettings: (field: DatasetField) => void;
    handleRlsUpdate: (field: DatasetField) => void;
    rls: DatasetRls;
    permissions?: Permissions;
    handleTypeSelectUpdate: (field: DatasetField, cast: DATASET_FIELD_TYPES) => void;
    handleAggregationSelectUpdate: (
        field: DatasetField,
        aggregation: DatasetFieldAggregation,
    ) => void;
    handleDescriptionUpdate: (field: DatasetField, value: string) => void;
    handleMoreActionClick: (args: {action: FieldAction; field: DatasetField}) => void;
    onSelectChange: (
        isSelected: boolean,
        fields: (keyof DatasetSelectionMap)[],
        clickedIndex?: number,
        modifier?: {shiftKey: boolean},
    ) => void;
    readonly: boolean;
};

export const getAggregationSwitchTo = (
    options: DatasetOptions,
    currentAggregation: DatasetFieldAggregation,
    selectedCast: DATASET_FIELD_TYPES,
) => {
    const {aggregations: availableAggregations = []} =
        options.data_types.items.find(({type}) => type === selectedCast) || {};

    const isCurrentAggregationAvailableForCast = availableAggregations.includes(currentAggregation);

    return (
        isCurrentAggregationAvailableForCast ? currentAggregation : 'none'
    ) as DatasetFieldAggregation;
};

export const getColumns = (args: GetColumnsArgs) => {
    const {
        selectedRows,
        fieldsCount,
        avatars,
        fields,
        showFieldsId,
        onSelectChange,
        setActiveRow,
        openDialogFieldEditor,
        handleTitleUpdate,
        handleIdUpdate,
        handleHiddenUpdate,
        handleUpdateFieldSettings,
        handleTypeSelectUpdate,
        handleAggregationSelectUpdate,
        handleDescriptionUpdate,
        handleMoreActionClick,
        handleRlsUpdate,
        rls,
        permissions,
        readonly,
    } = args;
    const width = showFieldsId ? WIDTH_15 : WIDTH_20;
    const selectedCount = Object.keys(selectedRows).length;

    const index = getIndexColumn({
        selectedRows,
        isAllSelected: fieldsCount > 0 ? selectedCount === fieldsCount : false,
        indeterminate: fieldsCount > 0 && selectedCount > 0 ? selectedCount !== fieldsCount : false,
        onSelectChange,
        onSelectAllChange: (state: boolean) =>
            onSelectChange(
                state,
                fields.map(({guid}) => guid),
            ),
        readonly,
    });

    const title = getTitleColumn({
        width,
        setActiveRow,
        onUpdate: (row, value) => handleTitleUpdate(row, value),
        readonly,
    });
    const source = getSourceColumn({width, avatars, openDialogFieldEditor, readonly});
    const hidden = getHiddenColumn({onUpdate: handleHiddenUpdate, readonly});
    const cast = getCastColumn({fields, onUpdate: handleTypeSelectUpdate, readonly});
    const aggregation = getAggregationColumn({
        fields,
        onUpdate: handleAggregationSelectUpdate,
        readonly,
    });
    const description = getDescriptionColumn({
        setActiveRow,
        onUpdate: (row, value) => handleDescriptionUpdate(row, value),
        readonly,
    });
    const more = getMoreColumn({setActiveRow, onItemClick: handleMoreActionClick, readonly});

    const columns = [index, title, source];

    const fieldSettingsColumn = getFieldSettingsColumn({
        onUpdate: handleUpdateFieldSettings,
        readonly,
    });
    columns.push(fieldSettingsColumn);

    columns.push(...[hidden, cast, aggregation, description, more]);

    if (isEnabledFeature(Feature.DatasetsRLS) && (permissions?.admin || permissions?.edit)) {
        const rlsColumn = getRlsColumn({onUpdate: handleRlsUpdate, rls, readonly});

        columns.splice(4, 0, rlsColumn);
    }

    if (showFieldsId) {
        const id = getIdColumn({
            width: WIDTH_15,
            setActiveRow,
            onUpdate: (row, value) => handleIdUpdate(row, value),
            readonly,
        });
        columns.splice(2, 0, id);
    }

    return columns;
};

export const sortRslColumn = (
    row1: SortedDataItem<DatasetField>,
    row2: SortedDataItem<DatasetField>,
    rls: DatasetRls,
) => {
    const guidRow1 = get(row1, ['row', 'guid']);
    const guidRow2 = get(row2, ['row', 'guid']);
    const isRlsRow1 = Boolean(get(rls, guidRow1));
    const isRlsRow2 = Boolean(get(rls, guidRow2));

    return Number(isRlsRow1) - Number(isRlsRow2);
};
