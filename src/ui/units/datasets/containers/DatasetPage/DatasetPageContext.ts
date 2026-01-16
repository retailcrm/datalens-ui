import {createContext, useContext} from 'react';

import type {SDK} from 'ui';

export const DatasetPageContext = createContext<{
    sdk: SDK;
    datasetId: string;
}>({sdk: {} as SDK, datasetId: ''});

export const useDatasetPageContext = () => useContext(DatasetPageContext);
