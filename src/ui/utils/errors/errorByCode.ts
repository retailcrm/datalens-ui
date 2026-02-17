import {I18n} from 'i18n';
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
const validationI18n = I18n.keyset('validation');

const GENERIC_VALIDATION_MESSAGES = new Set(['validation error', 'validation_error']);
const VALIDATION_TEXT_KEYS = [
    'validationErrors',
    'validationError',
    'errors',
    'error',
    'message',
    'description',
    'detail',
    'reason',
] as const;

function normalizeErrorText(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normalizeEntryNameValidationText(value: string) {
    const withoutFieldPrefix = value.replace(/^data\.name\s+/i, '').trim();

    const isSlashValidation =
        /contain/i.test(withoutFieldPrefix) &&
        /symbol/i.test(withoutFieldPrefix) &&
        withoutFieldPrefix.includes('/');

    if (isSlashValidation) {
        return validationI18n('label_validation-slash_error');
    }

    const isSymbolsValidation =
        /should start and end with/i.test(withoutFieldPrefix) &&
        /can contain only symbols/i.test(withoutFieldPrefix);

    if (isSymbolsValidation) {
        return validationI18n('label_validation-symbols_error');
    }

    return withoutFieldPrefix;
}

function isGenericValidationMessage(value: string) {
    return GENERIC_VALIDATION_MESSAGES.has(value.toLowerCase());
}

function getValidationTextFromUnknown(value: unknown): string | null {
    const stringValue = normalizeErrorText(value);
    if (stringValue) {
        return isGenericValidationMessage(stringValue)
            ? null
            : normalizeEntryNameValidationText(stringValue);
    }

    if (Array.isArray(value)) {
        const messages = value
            .map((item) => getValidationTextFromUnknown(item))
            .filter((item): item is string => Boolean(item));

        if (messages.length === 0) {
            return null;
        }

        return Array.from(new Set(messages)).join('; ');
    }

    if (!value || typeof value !== 'object') {
        return null;
    }

    const record = value as Record<string, unknown>;

    for (const key of VALIDATION_TEXT_KEYS) {
        if (key in record) {
            const text = getValidationTextFromUnknown(record[key]);
            if (text) {
                return text;
            }
        }
    }

    // Some validators return arrays like [{path: ['data', 'name'], message: '...'}]
    // under non-standard keys; fallback to object values.
    for (const nestedValue of Object.values(record)) {
        const text = getValidationTextFromUnknown(nestedValue);
        if (text) {
            return text;
        }
    }

    return null;
}

function getDetailsValidationText(details: unknown): string | null {
    return getValidationTextFromUnknown(details);
}

export function getEntryNameInputError(
    error: DataLensApiError,
    duplicateNameErrorText: string,
): string | null {
    if (isEntryAlreadyExists(error)) {
        return duplicateNameErrorText;
    }

    const {code, message, status, details} = parseError(error);
    const normalizedMessage = normalizeErrorText(message);
    const detailsValidationText = getDetailsValidationText(details);

    const messageForInput =
        detailsValidationText ||
        (normalizedMessage && !isGenericValidationMessage(normalizedMessage)
            ? normalizeEntryNameValidationText(normalizedMessage)
            : null);

    if (!messageForInput) {
        return null;
    }

    if (code && NON_INPUT_ENTRY_ERROR_CODES.has(code)) {
        return null;
    }

    if (!code) {
        const isValidationStatus = status === 400 || status === 409 || status === 422;
        return isValidationStatus ? messageForInput : null;
    }

    const isUsRelatedError = code.startsWith('ERR.US.') || code.startsWith('ERR.DS_API.US.');
    if (isUsRelatedError) {
        return messageForInput;
    }

    const isValidationStatus = status === 400 || status === 409 || status === 422;
    return isValidationStatus ? messageForInput : null;
}
