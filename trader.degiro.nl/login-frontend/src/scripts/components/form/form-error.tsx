import {AppError, ErrorCodes, FieldErrors} from 'frontend-core/dist/models/app-error';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import isGroupAppError from 'frontend-core/dist/services/app-error/is-group-app-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {formError} from './form.css';

interface Props {
    error: Error | AppError;
}

const {useMemo, useContext} = React;
const FormError: React.FunctionComponent<Props> = ({error}) => {
    const i18n = useContext(I18nContext);
    const errorMessage: string = useMemo(() => {
        const fieldErrors: FieldErrors = getFieldErrors(error) || {};
        let errorMessage: string | undefined;

        Object.entries(fieldErrors).some(([, fieldError]: [string, AppError]) => {
            errorMessage = fieldError.text;

            return Boolean(errorMessage);
        });

        if (errorMessage) {
            return errorMessage;
        }

        // if it's a group error, show the first one
        const firstError: AppError | Error = isGroupAppError(error) ? error.errors[0] : error;

        if (isAppError(firstError)) {
            const {code} = firstError;

            if (code === ErrorCodes.ACTIVATION_CODE_DOES_NOT_MATCH) {
                return 'passwordReset.passwordResetForm.errors.activationCodeDoesNotMatch';
            }

            if (code === ErrorCodes.BAD_CREDENTIALS) {
                return 'login.loginForm.errors.invalidUsernameOrPassword';
            }

            errorMessage = firstError.text;
        }

        return errorMessage || 'errors.serviceError';
    }, [error]);

    return (
        <h3 data-name="formError" className={formError}>
            {localize(i18n, errorMessage)}
        </h3>
    );
};

export default React.memo(FormError);
