import type {ConnectionData} from 'shared';
import type {ConnectorItem, GetEntryResponse} from 'shared/schema';
import type {DataLensApiError} from 'ui';
import {getIsRevisionsSupported} from 'units/connections/utils';

import {api} from './api';

export interface GetConnectionDataRequestProps {
    entry?: GetEntryResponse;
    flattenConnectors: ConnectorItem[];
    rev_id?: string;
}

export async function getConnectionDataRequest({
    entry,
    flattenConnectors,
    rev_id,
}: GetConnectionDataRequestProps) {
    let revId: string | undefined;
    let connectionData: ConnectionData | undefined;
    let connectionError: DataLensApiError | undefined;

    if (entry) {
        const isRevisionsSupported = getIsRevisionsSupported({entry, flattenConnectors});
        if (isRevisionsSupported) {
            revId = rev_id;
        }
        ({connectionData, error: connectionError} = await api.fetchConnectionData(
            entry.entryId,
            entry?.workbookId ?? null,
            revId,
        ));
    }
    return {connectionData, connectionError};
}
