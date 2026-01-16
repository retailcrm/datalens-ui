import type {Field} from 'shared';

export const isFieldVisible = (field: Field) =>
    !(field.quickFormula || field.hidden || field.virtual);
