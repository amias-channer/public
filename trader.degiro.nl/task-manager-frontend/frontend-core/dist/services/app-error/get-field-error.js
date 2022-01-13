import getFieldErrors from './get-field-errors';
export default function getFieldError(error, field) {
    const fieldErrors = getFieldErrors(error);
    return fieldErrors && fieldErrors[field];
}
//# sourceMappingURL=get-field-error.js.map