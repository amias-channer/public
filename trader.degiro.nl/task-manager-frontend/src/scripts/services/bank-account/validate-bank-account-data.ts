import {AppError, ErrorCodes, PlainAppError} from 'frontend-core/dist/models/app-error';
import {BankAccountInfo} from 'frontend-core/dist/models/bank';
import normalizeIban from './normalize-iban';

export const numericFields: string[] = ['sortCode', 'number'];

export default function validateBankAccountData(formData: Partial<BankAccountInfo>) {
    if (formData.iban != null) {
        const iban: string = normalizeIban(formData.iban);

        if (!iban) {
            return new AppError({
                errors: [
                    {
                        field: 'iban',
                        code: ErrorCodes.VALIDATION,
                        text: 'errors.field.required'
                    }
                ]
            });
        }
    }

    const errors = numericFields.reduce((errors: PlainAppError[], field: string) => {
        if ((formData as {[key: string]: any})[field] != null) {
            const value: string = (formData as {[key: string]: any})[field].replace(/\s/g, '');

            if (value) {
                if (!/^[0-9]+$/.test(value)) {
                    errors.push({
                        field,
                        code: ErrorCodes.VALIDATION,
                        text: 'errors.field.invalid.format'
                    });
                }
            } else {
                errors.push({
                    field,
                    code: ErrorCodes.VALIDATION,
                    text: 'errors.field.required'
                });
            }
        }

        return errors;
    }, []);

    if (errors[0]) {
        return new AppError({errors});
    }
}
