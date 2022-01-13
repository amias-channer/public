import {AppError} from 'frontend-core/dist/models/app-error';

export default function isMissingTaskError(error: Error | AppError): boolean {
    return (error as AppError).httpStatus === 404;
}
