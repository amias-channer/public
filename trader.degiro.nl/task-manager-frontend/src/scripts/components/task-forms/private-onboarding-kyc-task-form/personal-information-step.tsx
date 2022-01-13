import Button from 'frontend-core/dist/components/ui-trader3/button';
import Input from 'frontend-core/dist/components/ui-trader3/input';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import hasFormError from 'frontend-core/dist/services/form/has-form-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import {FullNameInformation, TaskStatusInformation} from '../../../models/private-onboarding-kyc-task';
import getFullNameInformation from '../../../services/private-onboarding-kyc-task/get-full-name-information';
import saveFullNameInformation from '../../../services/private-onboarding-kyc-task/save-full-name-information';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import useFormError from '../../task-form/hooks/use-form-error';
import TaskBackButton from '../../task-form/task-back-button';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    onBack(): void;
    onSubmit(taskStatusInformation: TaskStatusInformation): void;
}

const {useContext, useEffect, useState} = React;
const PersonalInformationStep: React.FunctionComponent<Props> = ({task, onSubmit, onBack}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const app = useContext(AppApiContext);
    const i18nTranslationCode = `task.${task.taskType}.PERSONAL_INFORMATION`;
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        isLoading: isFullNameInformationLoading,
        value: fullNameInformation = {firstName: '', lastName: ''},
        error: fullNameInformationError
    } = useAsync<FullNameInformation>(() => getFullNameInformation(config, task), [config, task]);
    const error: AppError | undefined = useFormError(submissionError || fullNameInformationError);
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataValues: FullNameInformation = {
            ...fullNameInformation,
            ...getFormData(event.currentTarget, {keepOriginValue: true})
        };

        setIsSubmitting(true);
        setSubmissionError(undefined);

        saveFullNameInformation(config, task, formDataValues)
            .then(onSubmit)
            .catch(setSubmissionError)
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    useEffect(() => {
        if (error && !hasFormError(error, Object.keys(fullNameInformation))) {
            app.openErrorModal(error);
        }
    }, [error]);

    const fieldErrors: FieldErrors = (error && getFieldErrors(error)) || {};

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            {isSubmitting || isFullNameInformationLoading ? (
                <Spinner local={true} />
            ) : (
                <form method="POST" autoComplete="off" className={taskFormStyles.form} onSubmit={onSubmitForm}>
                    <div data-name="fullNameInformationStep">
                        <div className={gridStyles.row}>
                            <Cell size={9} smallSize={4} mediumSize={6}>
                                <Input
                                    name="firstName"
                                    error={localizeError(i18n, fieldErrors.firstName)}
                                    required={true}
                                    label={localize(i18n, 'taskManager.task.taskForm.firstName')}
                                    placeholder={localize(i18n, 'taskManager.task.taskForm.firstName')}
                                    value={fullNameInformation.firstName}
                                />
                            </Cell>
                        </div>
                        <div className={gridStyles.row}>
                            <Cell size={9} smallSize={4} mediumSize={6}>
                                <Input
                                    name="lastName"
                                    error={localizeError(i18n, fieldErrors.lastName)}
                                    required={true}
                                    label={localize(i18n, 'taskManager.task.taskForm.lastName')}
                                    placeholder={localize(i18n, 'taskManager.task.taskForm.lastName')}
                                    value={fullNameInformation.lastName}
                                />
                            </Cell>
                        </div>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={12}>
                            <Separator />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={12} className={taskFormStyles.formButtons}>
                            <TaskBackButton onClick={onBack} />
                            <Button type="submit" className={taskFormStyles.formSubmitButton}>
                                {localize(i18n, 'taskManager.task.goToNextStep')}
                            </Button>
                        </Cell>
                    </div>
                </form>
            )}
        </div>
    );
};

export default React.memo(PersonalInformationStep);
