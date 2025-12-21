import React from 'react';

import {Breadcrumbs} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {I18n} from 'i18n';
import type {GetCollectionBreadcrumbsResponse} from 'shared/schema';
import {Capability, useCapabilities} from 'ui/capabilities';

import './CollectionsStructureBreadcrumbs.scss';

const i18n = I18n.keyset('component.collection-breadcrumbs');

const b = block('dl-breadcrumbs-collections-structure-breadcrumbs');

export const CollectionsStructureBreadcrumbs: React.FC<{
    items: GetCollectionBreadcrumbsResponse;
    onChange: (collectionId: string | null) => void;
}> = ({items, onChange}) => {
    const capabilities = useCapabilities();

    return (
        <div className={b()}>
            <Breadcrumbs>
                {capabilities[Capability.AccessibleCollectionsRoot] && (
                    <Breadcrumbs.Item className={b('item')}>
                        <div onClick={() => onChange(null)}>{i18n('label_root-title')}</div>
                    </Breadcrumbs.Item>
                )}
                {items.map(({collectionId, title}, index) => (
                    <Breadcrumbs.Item key={index} className={b('item')}>
                        <div onClick={() => onChange(collectionId)}>{title}</div>
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs>
        </div>
    );
};
