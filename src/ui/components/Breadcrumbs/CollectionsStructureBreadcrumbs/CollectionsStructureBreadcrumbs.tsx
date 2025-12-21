import React from 'react';

import {Breadcrumbs} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import type {GetCollectionBreadcrumbsResponse} from 'shared/schema';

import './CollectionsStructureBreadcrumbs.scss';

const b = block('dl-breadcrumbs-collections-structure-breadcrumbs');

export const CollectionsStructureBreadcrumbs: React.FC<{
    items: GetCollectionBreadcrumbsResponse;
    onChange: (collectionId: string | null) => void;
}> = ({items, onChange}) => {
    return (
        <div className={b()}>
            <Breadcrumbs>
                {items.map(({collectionId, title}, index) => (
                    <Breadcrumbs.Item key={index} className={b('item')}>
                        <div onClick={() => onChange(collectionId)}>{title}</div>
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs>
        </div>
    );
};
