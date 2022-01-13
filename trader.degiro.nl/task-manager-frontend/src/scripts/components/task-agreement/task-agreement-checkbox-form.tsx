import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldError from 'frontend-core/dist/services/app-error/get-field-error';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import {TaskConfirmationTypes, TaskResult} from '../../models/task';
import saveTaskAgreement from '../../services/task/save-task-agreement';
import validateTaskAgreement from '../../services/task/validate-task-agreement';
import {AppApiContext, ConfigContext, I18nContext} from '../app-component/app-context';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import TaskAgreementCheckboxData from './task-agreement-checkbox-data';

interface Props {
    task: Task;
    onSubmitResult: (result?: TaskResult) => void;
    fieldName?: string;
    checked?: boolean;
}

const {useState, useEffect, useCallback, useContext} = React;
const TaskAgreementCheckboxForm: React.FunctionComponent<Props> = ({
    task,
    children,
    fieldName = 'isAgreeWithTerms',
    onSubmitResult
}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const [fieldValue, setFieldValue] = useState<boolean | undefined>();
    const [error, setError] = useState<AppError | Error | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fieldError: AppError | undefined = isAppError(error) ? getFieldError(error, fieldName) : undefined;
    const toggleAgreement = useCallback(() => {
        setFieldValue((fieldValue) => !fieldValue);
    }, []);
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const error: AppError | undefined = validateTaskAgreement(
            {[fieldName]: fieldValue},
            {
                confirmationType: TaskConfirmationTypes.AGREEMENT_CHECKBOX,
                agreementCheckboxFieldName: fieldName
            }
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setIsLoading(true);

        saveTaskAgreement(config, task)
            .then(onSubmitResult)
            .catch((error: Error | AppError) => {
                setError(error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (error && !fieldError) {
            app.openErrorModal(error);
        }
    }, [error, fieldError]);

    if (isLoading) {
        return (
            <div className={gridStyles.row}>
                <Cell size={12} align="center">
                    <Spinner local={true} />
                </Cell>
            </div>
        );
    }

    return (
        <form method="POST" autoComplete="off" data-name="taskAgreementCheckboxForm" onSubmit={onSubmit}>
            <TaskAgreementCheckboxData
                task={task}
                fieldName={fieldName}
                onChange={toggleAgreement}
                error={fieldError && localizeError(i18n, fieldError)}
                checked={fieldValue}
            />
            {children}
        </form>
    );
};

export default React.memo<React.PropsWithChildren<Props>>(TaskAgreementCheckboxForm);
