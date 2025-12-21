import {I18n} from 'i18n';
import {EntryScope} from 'shared';
import type {WorkbookWithPermissions} from 'shared/schema';
import {Capability, capabilities} from 'ui/capabilities';
import {DL} from 'ui/constants/common';

import {TAB_ALL} from './constants';
import type {Item} from './types';

const i18n = I18n.keyset('new-workbooks.table-filters');

export const getWorkbookTabs = (workbook: WorkbookWithPermissions): Item[] => {
    const tabs: Item[] = [
        {id: TAB_ALL, title: i18n('switch_filter-by-scope-all')},
        {id: EntryScope.Dash, title: i18n('switch_filter-by-scope-dash')},
        {id: EntryScope.Widget, title: i18n('switch_filter-by-scope-widget')},
    ];

    if (
        !DL.IS_MOBILE &&
        (!DL.IAM_RESOURCES?.workbook.roles.limitedViewer || workbook.permissions.view)
    ) {
        tabs.push({id: EntryScope.Dataset, title: i18n('switch_filter-by-scope-dataset')});

        if (capabilities.has(Capability.ManageableConnections)) {
            tabs.push({
                id: EntryScope.Connection,
                title: i18n('switch_filter-by-scope-connection'),
            });
        }
    }

    return tabs;
};
