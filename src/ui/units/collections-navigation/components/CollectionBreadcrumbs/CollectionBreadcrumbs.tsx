import React from 'react';

import {Breadcrumbs, Skeleton} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import type {GetCollectionBreadcrumbsResponse, GetWorkbookResponse} from 'shared/schema';
import {useRouter} from 'ui/navigation';
import type {Router} from 'ui/navigation';
import {COLLECTIONS_PATH, WORKBOOKS_PATH} from 'ui/units/collections-navigation/constants';

import './CollectionBreadcrumbs.scss';

const b = block('dl-collection-breadcrumbs');

const LOADING_ITEM_ID = '__loading';

type BreadcrumbsItem = {
    id: string | null;
    text: string;
    action: (event: React.MouseEvent<HTMLElement, MouseEvent> | KeyboardEvent) => void;
    path: string;
};

type Props = {
    className?: string;
    isLoading?: boolean;
    collections: GetCollectionBreadcrumbsResponse;
    workbook: GetWorkbookResponse | null;
    onItemClick?: (args: {id: string | null; isCurrent: boolean}) => void;
};

const getFallbackItem = () => ({
    id: LOADING_ITEM_ID,
    text: '',
    action: () => {},
    path: '',
});

const getWorkbookItem = (workbook: GetWorkbookResponse, router: Router) => ({
    id: workbook.workbookId,
    text: workbook.title,
    action: () => {
        router.push(`${WORKBOOKS_PATH}/${workbook.workbookId}`);
    },
    path: `${WORKBOOKS_PATH}/${workbook.workbookId}`,
});

export const CollectionBreadcrumbs = React.memo<Props>(
    ({className, isLoading = false, collections, workbook, onItemClick}) => {
        const router = useRouter();
        const items = React.useMemo<BreadcrumbsItem[]>(() => {
            return isLoading
                ? [getFallbackItem()]
                : collections
                      .map((item) => ({
                          id: item.collectionId,
                          text: item.title,
                          action: () => {
                              router.push(`${COLLECTIONS_PATH}/${item.collectionId}`);
                          },
                          path: `${COLLECTIONS_PATH}/${item.collectionId}`,
                      }))
                      .concat(workbook ? [getWorkbookItem(workbook, router)] : []);
        }, [isLoading, router, collections, workbook]);

        return (
            <div className={b(null, className)}>
                <Breadcrumbs className={b('container')}>
                    {items.map((item, index, list) => {
                        const isLast = index === list.length - 1;
                        const url = new URL(item.path ?? '/', 'http://sample.test');

                        return (
                            <Breadcrumbs.Item
                                key={index}
                                onClick={(event) => {
                                    if (!event.metaKey && onItemClick) {
                                        event.preventDefault();

                                        onItemClick({id: item.id, isCurrent: isLast});
                                        item.action(event);
                                    }
                                }}
                                className={b('item')}
                                disabled={isLast}
                                href={router.history.createHref({
                                    pathname: url.pathname,
                                    search: url.search,
                                })}
                            >
                                {item.id === LOADING_ITEM_ID ? (
                                    <Skeleton className={b('skeleton')} />
                                ) : (
                                    item.text
                                )}
                            </Breadcrumbs.Item>
                        );
                    })}
                </Breadcrumbs>
            </div>
        );
    },
);

CollectionBreadcrumbs.displayName = 'CollectionBreadcrumbs';
