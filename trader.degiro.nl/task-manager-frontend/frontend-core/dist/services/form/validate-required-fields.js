import { ErrorCodes, AppError } from '../../models/app-error';
export default function validateRequiredFields(data, requiredFields) {
    const errors = requiredFields.reduce((errors, field) => {
        /**
         * All task forms follow the next validation rules:
         *  - required value from CHECKBOX - true, non-zero number, non-empty string
         *  - required value from RADIO - true, non-zero number, non-empty string
         *  - required value from INPUT - non-zero number, non-empty string
         *  - required value from SELECT - true, non-zero number, non-empty string
         */
        if (!data[field]) {
            errors.push({
                field,
                code: ErrorCodes.VALIDATION,
                text: 'errors.field.required'
            });
        }
        return errors;
    }, []);
    if (errors[0]) {
        return new AppError({ errors });
    }
}
//# sourceMappingURL=validate-required-fields.js.map