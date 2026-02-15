import {ErrorCode} from 'shared';
import type {DataLensApiError} from 'typings';

import {parseError} from './parse';

interface EntryIsLockedError extends Error {
    code: ErrorCode.EntryIsLocked;
    details: {
        login: string;
        // TODO: after CHARTS-6891, use loginOrId instead of login
        loginOrId?: string;
        code?: string;
    };
    debug: {
        expiryDate: string;
    };
}

export function isEntryIsLockedError(error: DataLensApiError): error is EntryIsLockedError {
    return parseError(error).code === ErrorCode.EntryIsLocked;
}

export function getLoginOrIdFromLockedError(error: EntryIsLockedError) {
    return error.details.loginOrId || error.details.login;
}

export function isEntryAlreadyExists(error: DataLensApiError) {
    const {code} = parseError(error);
    if (code === ErrorCode.UsUniqViolation || code === ErrorCode.EntryAlreadyExists) {
        return true;
    }
    return false;
}

const NON_INPUT_ENTRY_ERROR_CODES = new Set<string>([
    ErrorCode.EntryIsLocked,
    ErrorCode.UsAccessDenied,
    ErrorCode.EntryForbidden,
]);

export function getEntryNameInputError(
    error: DataLensApiError,
    duplicateNameErrorText: string,
): string | null {
    if (isEntryAlreadyExists(error)) {
        return duplicateNameErrorText;
    }

    const {code, message} = parseError(error);

    if (!code || NON_INPUT_ENTRY_ERROR_CODES.has(code)) {
        return null;
    }

    const isUsRelatedError = code.startsWith('ERR.US.') || code.startsWith('ERR.DS_API.US.');
    if (!isUsRelatedError) {
        return null;
    }

    const normalizedMessage = message?.trim();
    return normalizedMessage || null;
}
