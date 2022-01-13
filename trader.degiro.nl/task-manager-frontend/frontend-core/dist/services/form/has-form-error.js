import getFieldErrors from '../app-error/get-field-errors';
export default function hasFormError(error, formFields) {
    const fieldErrors = getFieldErrors(error);
    if (!fieldErrors) {
        return false;
    }
    if (!formFields[0]) {
        return Boolean(Object.keys(fieldErrors)[0]);
    }
    return Object.keys(fieldErrors).some((field) => {
        return formFields.indexOf(field.split('.')[0].split('[')[0]) >= 0;
    });
}
//# sourceMappingURL=has-form-error.js.map