import {getTypedApiFactory} from '@gravity-ui/gateway';

import type {AuthSchema} from './auth-schema';

import type {schema} from './index';

export const getTypedApi = getTypedApiFactory<{
    root: typeof schema;
    auth: AuthSchema;
}>();

export type TypedApi = ReturnType<typeof getTypedApi>;
