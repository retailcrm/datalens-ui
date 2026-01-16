import {lockedTextInfo} from 'components/RevisionsPanel/RevisionsPanel';
import type {History, Location} from 'history';
import {I18n} from 'i18n';
import {sdk} from 'libs/sdk';
import {DashSchemeConverter, EntryScope, Feature} from 'shared';
import type {GetEntryArgs} from 'shared/schema';
import {closeDialog as closeDialogConfirm, openDialogConfirm} from 'store/actions/dialog';
import type {DatalensGlobalState} from 'ui';
import {DL, MarkdownProvider, URL_QUERY, Utils} from 'ui';
import {getSdk} from 'ui/libs/schematic-sdk';
import {getRouter} from 'ui/navigation';
import {registry} from 'ui/registry';
import {showToast} from 'ui/store/actions/toaster';
import type {ConnectionsReduxDispatch} from 'ui/units/connections/store';
import type {ManualError} from 'ui/utils/errors/manual';
import {isEnabledFeature} from 'ui/utils/isEnabledFeature';
import {getLoginOrIdFromLockedError, isEntryIsLockedError} from 'utils/errors/errorByCode';

import type {DashDispatch} from '..';
import logger from '../../../../../libs/logger';
import {DashErrorCode, Mode} from '../../../modules/constants';
import {collectDashStats} from '../../../modules/pushStats';
import type {DashState} from '../../typings/dash';
import {getFakeDashEntry} from '../../utils';
import {
    SET_ERROR_MODE,
    SET_STATE,
    resetDashEditHistory,
    setDashViewMode,
    setLock,
    toggleTableOfContent,
} from '../dashTyped';
import {
    DOES_NOT_EXIST_ERROR_TEXT,
    NOT_FOUND_ERROR_TEXT,
    applyDataProviderChartSettings,
    getCurrentTab,
    removeParamAndUpdate,
} from '../helpers';

import {getGlobalStatesForInactiveTabs} from './helpers';

const i18n = I18n.keyset('dash.store.view');

export const setEditMode = (successCallback = () => {}, failCallback = () => {}) => {
    return async function (dispatch: DashDispatch, getState: () => DatalensGlobalState) {
        const {
            dash: {
                entry: {entryId, savedId: stateSavedId, fake},
                mode,
            },
        } = getState();

        if (fake) {
            dispatch(resetDashEditHistory());
            return;
        }

        try {
            const {savedId} = await getSdk().sdk.us.getEntryMeta({entryId});

            if (stateSavedId !== savedId) {
                dispatch(
                    openDialogConfirm({
                        onApply: () => {
                            getRouter().reload();
                        },
                        message: i18n('label_obsolete-version'),
                        isWarningConfirm: true,
                        cancelButtonView: 'flat',
                        confirmButtonView: 'normal',
                        showIcon: false,
                        onCancel: () => {
                            failCallback();
                            (dispatch as ConnectionsReduxDispatch)(closeDialogConfirm());
                        },
                        widthType: 'medium',
                        confirmHeaderText: i18n('label_obsolete-dash'),
                        cancelButtonText: i18n('button_cancel'),
                        confirmButtonText: i18n('button_reload-page'),
                    }),
                );

                return;
            }

            await dispatch(setLock(entryId));
            dispatch(resetDashEditHistory());
            successCallback();
        } catch (error) {
            if (isEntryIsLockedError(error)) {
                const loginOrId = getLoginOrIdFromLockedError(error);

                dispatch(
                    openDialogConfirm({
                        onApply: async () => {
                            try {
                                await dispatch(setLock(entryId, true));
                                (dispatch as ConnectionsReduxDispatch)(closeDialogConfirm());
                                successCallback();
                                dispatch(resetDashEditHistory());
                            } catch (localError) {
                                dispatch(
                                    showToast({
                                        error: localError,
                                        title: i18n('label_unexpected-error'),
                                    }),
                                );
                                failCallback();
                            }
                        },
                        message: lockedTextInfo(loginOrId, EntryScope.Dash),
                        isWarningConfirm: true,
                        cancelButtonView: 'flat',
                        confirmButtonView: 'normal',
                        showIcon: false,
                        onCancel: () => {
                            failCallback();
                            if (mode === Mode.Edit) {
                                dispatch(setDashViewMode());
                            }
                            (dispatch as ConnectionsReduxDispatch)(closeDialogConfirm());
                        },
                        widthType: 'medium',
                        confirmHeaderText: i18n('label_dash-is-editing'),
                        cancelButtonText: i18n('button_cancel'),
                        confirmButtonText: i18n('button_edit-anyway'),
                    }),
                );

                return;
            }

            dispatch(
                showToast({
                    error,
                    title: i18n('label_unexpected-error'),
                }),
            );
            failCallback();
        }
    };
};

/**
 * Loading dash data: dash config from us, dash state from us, and in parallel all datasets schemas, which is used in dash items
 * @param location
 * @param history
 * @param params
 * @returns {(function(*): Promise<void>)|*}
 */
export const load = ({
    location,
    history,
    params,
}: {
    location: Location;
    history: History;
    params?: Record<string, string>;
}) => {
    // eslint-disable-next-line complexity
    return async function (dispatch: DashDispatch) {
        try {
            dispatch({
                type: SET_STATE,
                payload: {mode: Mode.Loading, error: null},
            });

            const {pathname, search} = location;

            const searchParams = new URLSearchParams(search);

            const {extractEntryId} = registry.common.functions.getAll();

            const entryId = extractEntryId(pathname);

            if (
                !entryId &&
                (pathname === '/dashboards/new' || pathname.startsWith('/workbooks/'))
            ) {
                removeParamAndUpdate(history, searchParams, URL_QUERY.TAB_ID);
                dispatch({
                    type: SET_STATE,
                    payload: getFakeDashEntry(params?.workbookId),
                });
                await dispatch(setEditMode());
                return;
            }

            if (!entryId) {
                throw new Error(NOT_FOUND_ERROR_TEXT);
            }

            const hash = searchParams.get('state');
            const revId = searchParams.get(URL_QUERY.REV_ID);
            const readDashParams: Omit<GetEntryArgs, 'entryId'> = {
                includePermissionsInfo: true,
                includeLinks: true,
                includeFavorite: true,
                branch: 'published',
            };

            if (revId) {
                readDashParams.revId = revId;
            }

            const [entry, hashData] = await Promise.all([
                // TODO Refactor old api schema
                (sdk.charts as any).readDash({
                    id: entryId,
                    params: readDashParams,
                }),
                hash
                    ? getSdk()
                          .sdk.us.getDashState({
                              entryId,
                              hash,
                          })
                          .catch((error) => {
                              logger.logError('getDashState failed', error);
                              console.error('STATE_LOAD', error);
                          })
                    : null,
            ]);

            if (!entry?.entryId || entry?.scope !== EntryScope.Dash) {
                throw new Error(NOT_FOUND_ERROR_TEXT);
            }

            let data = entry.data;
            let convertedEntryData;
            if (DashSchemeConverter.isUpdateNeeded(entry.data)) {
                dispatch({
                    type: SET_STATE,
                    payload: {mode: Mode.Updating},
                });
                data = DashSchemeConverter.update(entry.data);
                convertedEntryData = data;
            }

            // fix try to open not dashboard entry
            if (!data.tabs) {
                throw new Error(NOT_FOUND_ERROR_TEXT);
            }

            const {tabId, widgetsCurrentTab} = getCurrentTab({searchParams, data, history});

            // without await, they will start following each markdown separately

            const [updatedHashStates, _] = await Promise.all([
                getGlobalStatesForInactiveTabs({
                    state: hashData?.data,
                    data,
                    currentTabId: tabId,
                }),
                MarkdownProvider.init(data),
            ]);

            let hashStates = {};
            if (hashData) {
                // TODO find out from what controls field is
                const {controls, ...states} = hashData.data as any;
                hashStates = {
                    [tabId]: {
                        hash,
                        state: {...controls, ...states},
                    },
                    ...(updatedHashStates || {}),
                };
            }

            if (isEnabledFeature(Feature.ReadOnlyMode)) {
                entry.permissions.admin = false;
                entry.permissions.edit = false;
            }

            const isEmptyDash = data.tabs.length === 1 && !data.tabs[0].items.length;
            const hasEditPermissions = entry?.permissions?.admin || entry?.permissions?.edit;
            const isOpenedActualRevision = !revId;
            const isAvailableEditMode = !isEnabledFeature(Feature.ReadOnlyMode) && !DL.IS_MOBILE;

            const mode =
                isEmptyDash && isOpenedActualRevision && hasEditPermissions && isAvailableEditMode
                    ? Mode.Edit
                    : Mode.View;

            collectDashStats({
                dashId: entryId,
                dashTabId: tabId,
                dashStateHash: hash,
            });

            if (data.settings) {
                if (!DL.IS_MOBILE) {
                    // Boolean is used to handle the case when there is no expandTOC setting in the object (undefined)
                    dispatch(toggleTableOfContent(Boolean(data.settings.expandTOC)));
                }

                applyDataProviderChartSettings({data});
            }

            dispatch({
                type: SET_STATE,
                payload: {
                    permissions: entry.permissions,
                    navigationPath: Utils.getNavigationPathFromKey(entry.key),
                    mode,
                    entry,
                    hashStates,
                    data,
                    convertedEntryData,
                    tabId,
                    stateHashId: hash,
                    currentRevId: entry.revId,
                    widgetsCurrentTab,
                    openInfoOnLoad: searchParams.get(URL_QUERY.OPEN_DASH_INFO) === '1',
                    annotation: entry.annotation,
                },
            });

            if (mode === Mode.Edit) {
                await dispatch(setEditMode());
            }
        } catch (error) {
            logger.logError('load dash failed', error);

            const errorMessage = error?.response?.data?.message || error?.message;
            // TODO It's invalid error object as legacy it's here but research should be made
            let errorParams: DashState['error'] | ManualError = {
                code: errorMessage,
                status: error.request?.status,
            } as any;

            if (
                errorMessage === NOT_FOUND_ERROR_TEXT ||
                errorMessage === DOES_NOT_EXIST_ERROR_TEXT
            ) {
                errorParams = {
                    code: DashErrorCode.NOT_FOUND,
                    status: 404,
                    _manualError: true,
                } as ManualError;
                dispatch({
                    type: SET_ERROR_MODE,
                    payload: {
                        error: errorParams,
                    },
                });
            }

            dispatch({
                type: SET_STATE,
                payload: {
                    mode: Mode.Error,
                    error: errorParams,
                },
            });
        }
    };
};

export {SAVE_DASH_SUCCESS} from './save';
export type {SaveDashSuccessAction} from './save';

export {SAVE_DASH_ERROR} from './save';
export type {SaveDashErrorAction} from './save';

export {save} from './save';
