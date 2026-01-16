import type {SelectorsGroupDialogState} from 'store/typings/controlDialog';

export function getGroupSelectorDialogInitialState(): SelectorsGroupDialogState {
    return {
        showGroupName: false,
        autoHeight: false,
        buttonApply: false,
        buttonReset: false,
        updateControlsOnChange: true,
        impactType: undefined,
        impactTabsIds: undefined,
        group: [],
        validation: {},
    };
}
