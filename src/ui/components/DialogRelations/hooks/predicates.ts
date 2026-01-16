import type {
    DashkitMetaDataItem,
    DashkitMetaDataItemNoRelations,
} from 'components/DialogRelations/types';
import intersection from 'lodash/intersection';
import type {StringParams} from 'shared';
import {DASH_WIDGET_TYPES} from 'units/dash/modules/constants';

export const hasCommonDefaultsWithDefaults = (
    widgetParams: StringParams,
    itemWidgetParams: StringParams,
) => {
    return Boolean(
        intersection(Object.keys(widgetParams || {}), Object.keys(itemWidgetParams || {})).length,
    );
};

export const hasCommonUsedParamsWithDefaults = (
    widgetParams: StringParams,
    usedParams: string[],
) => {
    return Boolean(intersection(Object.keys(widgetParams || {}), usedParams).length);
};

export const isControl = (item: DashkitMetaDataItem | DashkitMetaDataItemNoRelations) =>
    item.type === DASH_WIDGET_TYPES.CONTROL;

export const isDatasetControl = (item: DashkitMetaDataItemNoRelations) =>
    isControl(item) && item.datasetId;

export const isExternalControl = (item: DashkitMetaDataItemNoRelations) =>
    isControl(item) && item.chartId;

export const isManualControl = (item: DashkitMetaDataItemNoRelations) =>
    isControl(item) && !item.datasetId && !item.chartId;
