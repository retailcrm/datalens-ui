import type {Field, ServerField} from '../types';

export const isParameter = (field: Partial<Field> | Partial<ServerField>) => {
    return field.calc_mode === 'parameter';
};
