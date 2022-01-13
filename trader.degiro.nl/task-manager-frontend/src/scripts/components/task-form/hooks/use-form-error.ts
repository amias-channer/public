import {AppError, ErrorCodes} from 'frontend-core/dist/models/app-error';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Routes} from '../../../navigation';
import isMissingTaskError from '../../../services/task/is-missing-task-error';

const getCommonSubmitError = (error: AppError | Error): AppError => {
    const firstError: AppError | undefined = isAppError(error) ? error.errors[0] : undefined;

    // Show first error text if we have that
    if (firstError && firstError.code === ErrorCodes.VALIDATION) {
        return firstError;
    }

    // continue using error if it has a message
    if (isAppError(error) && error.text) {
        return error;
    }

    return new AppError({text: 'errors.serviceError'});
};

export default function useFormError(error: Error | AppError | undefined): AppError | undefined {
    const history = useHistory();

    useEffect(() => {
        if (error && isMissingTaskError(error)) {
            history.push(Routes.TASKS);
        }
    }, [error]);

    return !error || isMissingTaskError(error) ? undefined : getCommonSubmitError(error);
}
