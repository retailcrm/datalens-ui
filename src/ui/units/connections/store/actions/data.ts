import {batch} from 'react-redux';
import type {ConnectionData} from 'shared';
import {showToast} from 'store/actions/toaster';
import type {DataLensApiError} from 'ui';
import {registry} from 'ui/registry';
import type {ConnectionEntry, ConnectionsReduxDispatch, GetState} from 'units/connections/store';
import {getFlattenConnectors} from 'units/connections/store/utils';

import {api} from './api';
import {
    resetFormsData,
    setCheckData,
    setConectorData,
    setEntry,
    setFlattenConnectors,
    setGroupedConnectors,
    setPageLoading,
    setValidationErrors,
} from './base';
import {getConnectionDataRequest} from './connection';

export function setPageData({
    entryId,
    workbookId,
    collectionId,
    rev_id,
    bindedWorkbookId,
}: {
    entryId?: string | null;
    workbookId?: string;
    collectionId?: string;
    rev_id?: string;
    bindedWorkbookId?: string | null;
}) {
    return async (dispatch: ConnectionsReduxDispatch, getState: GetState) => {
        dispatch(setPageLoading({pageLoading: true}));
        const groupedConnectors = await api.fetchConnectors();
        const flattenConnectors = getFlattenConnectors(groupedConnectors);
        const {checkData, form, validationErrors} = getState().connections;
        let entry: ConnectionEntry | undefined;
        let entryError: DataLensApiError | undefined;
        let connectionData: ConnectionData | undefined;
        let connectionError: DataLensApiError | undefined;

        if (entryId) {
            ({entry, error: entryError} = await api.fetchEntry(entryId));
            ({connectionData, connectionError} = await getConnectionDataRequest({
                entry,
                flattenConnectors,
                rev_id,
            }));
        }

        if (entry?.collectionId && bindedWorkbookId) {
            const {delegation, error: delegationError} = await api.fetchSharedEntryDelegation(
                entry.entryId,
                bindedWorkbookId,
            );
            if (delegationError) {
                dispatch(
                    showToast({
                        title: delegationError.message,
                        error: delegationError,
                    }),
                );
            } else {
                entry.isDelegated = delegation?.isDelegated;
            }
        }

        if (!entry) {
            const getFakeEntry = registry.connections.functions.get('getFakeEntry');
            entry = getFakeEntry(workbookId, collectionId);
        }

        batch(() => {
            dispatch(setGroupedConnectors({groupedConnectors}));
            dispatch(setFlattenConnectors({flattenConnectors}));
            dispatch(
                setEntry({
                    entry: {...entry, revId: rev_id ?? entry?.publishedId ?? ''},
                    error: entryError,
                }),
            );

            if (Object.keys(form).length) {
                dispatch(resetFormsData());
            }

            if (entryId) {
                dispatch(
                    setConectorData({connectionData: connectionData || {}, error: connectionError}),
                );
            }

            if (checkData.status !== 'unknown') {
                dispatch(setCheckData({status: 'unknown'}));
            }

            if (validationErrors.length) {
                dispatch(setValidationErrors({errors: []}));
            }

            dispatch(setPageLoading({pageLoading: false}));
        });
    };
}
