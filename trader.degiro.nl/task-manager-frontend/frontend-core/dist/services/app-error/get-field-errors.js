import isAppError from './is-app-error';
export default function getFieldErrors(error) {
    let errors;
    let errorField;
    if (isAppError(error)) {
        errors = error.errors;
        errorField = error.field;
    }
    if (!errors) {
        return;
    }
    const fieldErrors = {};
    let found = false;
    errors.forEach((error) => {
        if (error.field) {
            found = true;
            fieldErrors[error.field] = error;
        }
    });
    if (found) {
        return fieldErrors;
    }
    if (errorField) {
        // it can be a single field error that was parsed as a main one
        return {
            [errorField]: error
        };
    }
}
//# sourceMappingURL=get-field-errors.js.map