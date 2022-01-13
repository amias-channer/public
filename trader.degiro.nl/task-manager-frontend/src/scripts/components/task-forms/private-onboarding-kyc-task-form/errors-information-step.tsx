import Button from 'frontend-core/dist/components/ui-trader3/button';
import {Task} from 'frontend-core/dist/models/task/task';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import {PrivateOnboardingKycTaskSteps, TaskStatusInformation} from '../../../models/private-onboarding-kyc-task';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    taskStatusInformation: TaskStatusInformation;
    onSubmit(): void;
}

const {useContext} = React;
const ErrorsInformationStep: React.FunctionComponent<Props> = ({task, onSubmit, taskStatusInformation}) => {
    const i18n = useContext(I18nContext);
    const {taskType} = task;
    const i18nTranslationCode = `task.${taskType}.ERRORS_INFORMATION`;
    const {globalErrors, inconsistentDataErrors} = taskStatusInformation;
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            <form method="POST" autoComplete="off" className={taskFormStyles.form} onSubmit={onFormSubmit}>
                <div data-name="errorsInformationStep">
                    {globalErrors && (
                        <div className={gridStyles.row}>
                            {globalErrors.map((errorI18nCode: string) => (
                                <Cell key={errorI18nCode} size={12}>
                                    {localize(i18n, errorI18nCode)}
                                </Cell>
                            ))}
                        </div>
                    )}
                    {inconsistentDataErrors && (
                        <div className={gridStyles.row}>
                            {Object.keys(inconsistentDataErrors).map((step) => (
                                <Cell key={step} size={12}>
                                    <b>{localize(i18n, `task.${taskType}.${step}.title`)}</b>
                                    {inconsistentDataErrors[step as PrivateOnboardingKycTaskSteps].map(
                                        (errorI18nCode: string) => (
                                            <div key={errorI18nCode}>{localize(i18n, errorI18nCode)}</div>
                                        )
                                    )}
                                </Cell>
                            ))}
                        </div>
                    )}
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <Separator />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12} className={taskFormStyles.formButtons}>
                        <Button type="submit" className={taskFormStyles.formSubmitButton}>
                            {localize(i18n, 'taskManager.task.goToNextStep')}
                        </Button>
                    </Cell>
                </div>
            </form>
        </>
    );
};

export default React.memo(ErrorsInformationStep);
