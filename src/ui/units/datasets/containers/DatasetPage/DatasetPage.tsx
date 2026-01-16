import React from 'react';

import block from 'bem-cn-lite';
import type {RouteComponentProps} from 'react-router-dom';
import {Feature} from 'shared';
import type {SDK} from 'ui';
import {getRouter} from 'ui/navigation';
import {registry} from 'ui/registry';
import {isEnabledFeature} from 'ui/utils/isEnabledFeature';

import {ActionQueryParam, QueryParam, mapYTClusterToConnId} from '../../constants/datasets';
import DatasetUtils, {isCreationProcess} from '../../helpers/utils';
import Dataset from '../Dataset/Dataset';

import {DatasetPageContext} from './DatasetPageContext';

import './DatasetPage.scss';

interface DatasetPageProps extends RouteComponentProps<Record<string, string>> {
    sdk: SDK;
    datasetId?: string;
    workbookId?: string;
    collectionId?: string;
    bindedWorkbookId?: string | null;
}

export {DatasetPageContext};

const b = block('dataset-page');

class DatasetPage extends React.Component<DatasetPageProps> {
    render() {
        const router = getRouter();

        return (
            <div className={b()}>
                <DatasetPageContext.Provider value={this.providerValue}>
                    <Dataset
                        sdk={this.props.sdk}
                        connectionId={this.connectionId}
                        datasetId={this.datasetId}
                        bindedWorkbookId={this.props.bindedWorkbookId}
                        workbookIdFromPath={this.props.workbookId}
                        collectionIdFromPath={this.props.collectionId}
                        history={this.props.history}
                        location={this.props.location}
                        ytPath={this.ytPath}
                        isCreationProcess={isCreationProcess(router.location().pathname)}
                        isAuto={this.isAuto}
                    />
                </DatasetPageContext.Provider>
            </div>
        );
    }

    get isAuto() {
        if (isEnabledFeature(Feature.EnableAutocreateDataset) || this.datasetId) {
            return false;
        }

        const action = DatasetUtils.getQueryParam(QueryParam.Action);
        const ytPath = DatasetUtils.getQueryParam(QueryParam.YtPath);

        // CHARTS-3534
        return Boolean(ytPath && action === ActionQueryParam.AutoCreate);
    }

    get connectionId() {
        const connectionId = DatasetUtils.getQueryParam('id');

        if (!connectionId) {
            return '';
        }

        const mappedConnId = mapYTClusterToConnId[connectionId];

        return mappedConnId || connectionId;
    }

    get datasetId() {
        if (!this.props.datasetId) {
            return '';
        }

        const {extractEntryId} = registry.common.functions.getAll();

        return extractEntryId(this.props.datasetId) || '';
    }

    get ytPath() {
        const ytPath = DatasetUtils.getQueryParam(QueryParam.YtPath);

        return ytPath ? decodeURIComponent(ytPath) : undefined;
    }

    get providerValue() {
        return {
            sdk: this.props.sdk,
            datasetId: this.datasetId,
        };
    }
}

export default DatasetPage;
