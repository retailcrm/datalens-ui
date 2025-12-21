import React from 'react';

import type {DropdownMenuItemMixed} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {I18n} from 'i18n';
import {EntryScope} from 'shared';
import {Capability, capabilities} from 'ui/capabilities';
import {EntityIcon} from 'ui/components/EntityIcon/EntityIcon';

import {CreateEntryActionType as CreateActionType} from '../../constants';

export type CreateEntryOptions = {
    buttonText: string;
    hasMenu: boolean;
    handleClick?: () => void;
    items: DropdownMenuItemMixed<unknown>[];
};

const i18n = I18n.keyset('new-workbooks');
const b = block('dl-workbook-create-entry');

const ChartQlItem = () => (
    <div className={b('dropdown-item')}>
        <EntityIcon type="chart-ql" />
        <div className={b('dropdown-text')}>{i18n('menu_ql-chart')}</div>
    </div>
);

const ChartWizardItem = () => (
    <div className={b('dropdown-item')}>
        <EntityIcon type="chart-wizard" />
        <div className={b('dropdown-text')}>{i18n('menu_wizard-chart')}</div>
    </div>
);

const ConnectionItem = () => (
    <div className={b('dropdown-item')}>
        <EntityIcon type="connection" />
        <div className={b('dropdown-text')}>{i18n('menu_connection')}</div>
    </div>
);

const DashboardItem = () => (
    <div className={b('dropdown-item')}>
        <EntityIcon type="dashboard" />
        <div className={b('dropdown-text')}>{i18n('menu_dashboard')}</div>
    </div>
);

const DatasetItem = () => (
    <div className={b('dropdown-item')}>
        <EntityIcon type="dataset" />
        <div className={b('dropdown-text')}>{i18n('menu_dataset')}</div>
    </div>
);

const defineOptions = (options: {
    text: string;
    onClick?: () => void;
    items?: DropdownMenuItemMixed<unknown>[];
}): CreateEntryOptions => ({
    buttonText: options.text,
    hasMenu: Number(options.items?.length) > 0,
    handleClick: options.onClick,
    items: options.items ?? [],
});

export const useCreateEntryOptions = ({
    scope,
    handleAction,
}: {
    scope?: EntryScope;
    handleAction: (type: CreateActionType) => void;
}): CreateEntryOptions => {
    const defineAction = (type: CreateActionType) => () => handleAction(type);

    if (scope === EntryScope.Dash) {
        return defineOptions({
            text: i18n('action_create-dashboard'),
            onClick: defineAction(CreateActionType.Dashboard),
        });
    }

    if (scope === EntryScope.Dataset) {
        return defineOptions({
            text: i18n('action_create-dataset'),
            onClick: defineAction(CreateActionType.Dataset),
        });
    }

    if (scope === EntryScope.Connection && capabilities.has(Capability.ManageableConnections)) {
        return defineOptions({
            text: i18n('action_create-connection'),
            onClick: defineAction(CreateActionType.Connection),
        });
    }

    if (scope === EntryScope.Widget) {
        return defineOptions({
            text: i18n('action_create-chart'),
            items: [
                {text: <ChartWizardItem />, action: defineAction(CreateActionType.Wizard)},
                {text: <ChartQlItem />, action: defineAction(CreateActionType.QL)},
            ],
        });
    }

    return defineOptions({
        text: i18n('action_create'),
        items: [
            [{text: <DashboardItem />, action: defineAction(CreateActionType.Dashboard)}],
            [
                {text: <ChartWizardItem />, action: defineAction(CreateActionType.Wizard)},
                {text: <ChartQlItem />, action: defineAction(CreateActionType.QL)},
            ],
            [
                {text: <DatasetItem />, action: defineAction(CreateActionType.Dataset)},
                {text: <ConnectionItem />, action: defineAction(CreateActionType.Connection)},
            ],
        ],
    });
};
