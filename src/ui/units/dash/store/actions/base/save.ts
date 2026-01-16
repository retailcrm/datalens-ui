import ChartKit from 'libs/DatalensChartkit';
import logger from 'libs/logger';
import type {DashEntry, EntryUpdateMode} from 'shared';
import type {DatalensGlobalState} from 'ui';
import {sdk} from 'ui';
import {Mode} from 'units/dash/modules/constants';
import type {DashDispatch} from 'units/dash/store/actions';
import {purgeData} from 'units/dash/store/actions/dashTyped';
import {isCallable} from 'units/dash/store/actions/helpers';
import type {DashState} from 'units/dash/store/typings/dash';

export const SAVE_DASH_SUCCESS = Symbol('dash/SAVE_DASH_SUCCESS');
export type SaveDashSuccessAction = {
    type: typeof SAVE_DASH_SUCCESS;
    payload: Partial<DashState>;
};

export const SAVE_DASH_ERROR = Symbol('dash/SAVE_DASH_ERROR');
export type SaveDashErrorAction = {
    type: typeof SAVE_DASH_ERROR;
};

export const save = (mode: EntryUpdateMode, isDraft = false) => {
    return async function (dispatch: DashDispatch, getState: () => DatalensGlobalState) {
        try {
            const isPublishing = mode === 'publish';
            const {entry: prevEntry, data, lockToken, annotation} = getState().dash;

            // TODO Refactor old api schema
            const updateData: {
                id: string;
                data: Partial<DashEntry> & {
                    lockToken: string | null;
                    description?: string;
                };
            } = {
                id: prevEntry.entryId,
                data: {
                    lockToken,
                    mode: mode,
                    meta: isPublishing ? {is_release: true} : {},
                    annotation: {
                        description: annotation?.description ?? '',
                    },
                },
            };
            if (isDraft && isPublishing) {
                updateData.data.revId = prevEntry.revId;
            } else {
                updateData.data.data = purgeData(data);
            }

            // TODO Refactor old api schema
            const entry = await (sdk.charts as any).updateDash(updateData);

            const newMaxConcurrentRequestsValue = entry.data.settings?.maxConcurrentRequests;
            const prevMaxConcurrentRequestsValue = prevEntry.data.settings?.maxConcurrentRequests;

            if (newMaxConcurrentRequestsValue !== prevMaxConcurrentRequestsValue) {
                isCallable(ChartKit.setDataProviderSettings)({
                    maxConcurrentRequests: newMaxConcurrentRequestsValue,
                });
            }

            dispatch({
                type: SAVE_DASH_SUCCESS,
                payload: {
                    mode: Mode.View,
                    data: entry.data,
                    convertedEntryData: null,
                    initialTabsSettings: null,
                    entry: {
                        ...prevEntry,
                        ...entry,
                    },
                    annotation: entry.annotation,
                },
            });
        } catch (error) {
            logger.logError('save dash failed', error);
            dispatch({type: SAVE_DASH_ERROR});
            throw error;
        }
    };
};
