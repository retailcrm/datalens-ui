import React from 'react';

import {Dialog, TextInput} from '@gravity-ui/uikit';
import type {TextInputProps} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {I18n} from 'i18n';
import {useDispatch, useSelector} from 'react-redux';
import type {DataLensApiError} from 'ui/typings';
import {getEntryNameInputError} from 'utils/errors/errorByCode';

import DialogManager from '../../../../components/DialogManager/DialogManager';
import type {AppDispatch} from '../../../../store';
import {showToast} from '../../../../store/actions/toaster';
import {renameEntry} from '../../store/actions';
import {selectRenameEntryIsLoading} from '../../store/selectors';
import type {WorkbookEntry} from '../../types';

import './RenameEntryDialog.scss';

const b = block('dl-workbook-rename-entry-dialog');

const i18n = I18n.keyset('new-workbooks');

export type Props = {
    open: boolean;
    data: WorkbookEntry;
    onClose: () => void;
};

export const DIALOG_RENAME_ENTRY_IN_NEW_WORKBOOK = Symbol('DIALOG_RENAME_ENTRY_IN_NEW_WORKBOOK');

export type OpenDialogRenameEntryInNewWorkbookArgs = {
    id: typeof DIALOG_RENAME_ENTRY_IN_NEW_WORKBOOK;
    props: Props;
};

const RenameEntryDialog = React.memo<Props>(({open, data, onClose}) => {
    const dispatch: AppDispatch = useDispatch();
    const isLoading = useSelector(selectRenameEntryIsLoading);

    const [newNameValue, setNewNameValue] = React.useState(data.name);
    const [inputError, setInputError] = React.useState<TextInputProps['error']>(false);
    const textInputControlRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open) {
            setNewNameValue(data.name);
            setInputError(false);
        }
    }, [data.name, open]);

    const handleApply = React.useCallback(async () => {
        const name = newNameValue.trim();

        try {
            const renamedEntry = await dispatch(
                renameEntry({
                    entryId: data.entryId,
                    name,
                    updateInline: true,
                }),
            );

            if (renamedEntry) {
                onClose();
            }
        } catch (error) {
            const errorMessage = getEntryNameInputError(
                error as DataLensApiError,
                i18n('label_entry-name-already-exists'),
            );
            if (errorMessage) {
                setInputError(errorMessage);
                return;
            }

            dispatch(
                showToast({
                    title: (error as DataLensApiError).message,
                    name: 'RenameEntryDialogFailed',
                    error,
                    withReport: true,
                }),
            );
        }
    }, [data.entryId, dispatch, newNameValue, onClose]);

    const handleInputUpdate = React.useCallback((value: string) => {
        setNewNameValue(value);
        setInputError(false);
    }, []);

    const propsButtonApply = React.useMemo(() => {
        const normalizedValue = newNameValue.trim();
        return {
            disabled: !normalizedValue || normalizedValue === data.name,
        };
    }, [data.name, newNameValue]);

    return (
        <Dialog
            size="s"
            open={open}
            onClose={onClose}
            onEnterKeyDown={handleApply}
            initialFocus={textInputControlRef}
        >
            <Dialog.Header caption={i18n('label_rename-entry')} />
            <Dialog.Body>
                <div className={b('label')}>{i18n('label_title')}</div>
                <TextInput
                    value={newNameValue}
                    controlRef={textInputControlRef}
                    onUpdate={handleInputUpdate}
                    error={inputError}
                />
            </Dialog.Body>
            <Dialog.Footer
                onClickButtonCancel={onClose}
                onClickButtonApply={handleApply}
                textButtonApply={i18n('action_rename')}
                textButtonCancel={i18n('action_cancel')}
                loading={isLoading}
                propsButtonApply={propsButtonApply}
            />
        </Dialog>
    );
});

RenameEntryDialog.displayName = 'RenameEntryDialog';

DialogManager.registerDialog(DIALOG_RENAME_ENTRY_IN_NEW_WORKBOOK, RenameEntryDialog);
