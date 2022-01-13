import {AppError, ErrorCodes, PlainAppError} from 'frontend-core/dist/models/app-error';
import {IexActions, IexParams} from '../../models/iex';

const requiredFields: Array<keyof IexParams> = ['iexId', 'iexAction', 'iexTimestamp', 'iexCode', 'iexReturnUrl'];

export default function validateIexParams(params: IexParams): AppError | undefined {
    const errors: PlainAppError[] = [];

    requiredFields.forEach((field: keyof IexParams) => {
        const value: string | number | undefined = params[field];

        if (!value && !(field === 'iexTimestamp' && value === 0)) {
            errors.push({code: ErrorCodes.VALIDATION, field, text: 'errors.field.required'});
        }
    });

    if (errors.length) {
        return new AppError({code: ErrorCodes.VALIDATION, errors});
    }

    if (![IexActions.SUBSCRIBE, IexActions.UNSUBSCRIBE].includes(params.iexAction)) {
        return new AppError({code: ErrorCodes.VALIDATION, text: 'Invalid iexAction'});
    }
}
