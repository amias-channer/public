import Button from 'frontend-core/dist/components/ui-trader3/button';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldError from 'frontend-core/dist/services/app-error/get-field-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import {PhoneInformationStepData} from '../../../models/phone-information';
import {PhoneVerificationConfirmationData, PhoneVerificationStartResult} from '../../../models/phone-verification-task';
import getTaskFormVirtualPageLocation from '../../../services/analytics/get-task-form-virtual-page-location';
import normalizeVerificationToken from '../../../services/phone-verification-task/normalize-verification-token';
import validatePhoneVerificationConfirmationStep from '../../../services/phone-verification-task/validate-phone-verification-confirmation-step';
import {I18nContext} from '../../app-component/app-context';
import InlineButton from '../../button/inline';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import InputNumber from '../../input-number/index';
import Separator from '../../separator';
import useFormError from '../../task-form/hooks/use-form-error';
import TaskBackButton from '../../task-form/task-back-button';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    startStepData: PhoneInformationStepData;
    startStepResult: PhoneVerificationStartResult;
    onPhoneEdit(): void;
    onBack?: () => void;
    onSubmit(phoneVerificationConfirmationData: PhoneVerificationConfirmationData): void;
}

const {useContext, useState, useEffect, useCallback} = React;
const PhoneVerificationConfirmationStep: React.FunctionComponent<Props> = ({
    task,
    startStepData,
    onPhoneEdit,
    startStepResult,
    onSubmit,
    onBack
}) => {
    const i18n = useContext(I18nContext);
    const i18nTranslationCode = `task.${task.taskType}.confirmationStep`;
    const [stateError, setStateError] = useState<AppError | undefined>(undefined);
    const formError: AppError | undefined = useFormError(stateError);
    const [token, setToken] = useState<string>('');
    const onTokenFieldChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
        setToken(event.currentTarget.value);
    }, []);
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData: PhoneVerificationConfirmationData = {
            token,
            reference: startStepResult.reference
        };
        const error: AppError | undefined = validatePhoneVerificationConfirmationStep(formData);

        if (error) {
            return setStateError(error);
        }

        setStateError(undefined);
        onSubmit({
            ...formData,
            token: normalizeVerificationToken(token)
        });
    };
    const tokenFieldError: AppError | undefined = formError && getFieldError(formError, 'token');
    const {phoneNumber} = startStepData;
    const {nationalNumber} = phoneNumber;

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {
            taskType: task.taskType,
            page: `${getTaskFormVirtualPageLocation(task)}/phone-confirmation`
        });
    }, []);

    return (
        <div data-name="phoneVerificationConfirmationStep">
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            <form method="POST" autoComplete="off" className={taskFormStyles.form} onSubmit={onSubmitForm}>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <strong>
                            {nationalNumber &&
                                localize(i18n, 'task.PHONE_VERIFICATION.confirmationStep.tokenHint', {
                                    phoneNumber: phoneNumber.countryCode + nationalNumber
                                })}
                        </strong>{' '}
                        <InlineButton onClick={onPhoneEdit}>
                            {localize(i18n, 'taskManager.task.editAction')}
                        </InlineButton>
                    </Cell>
                    <Cell size={9} smallSize={4} mediumSize={6}>
                        <InputNumber
                            name="token"
                            error={localizeError(i18n, tokenFieldError)}
                            autoComplete="one-time-code"
                            required={true}
                            autoFocus={true}
                            placeholder={localize(i18n, 'task.PHONE_VERIFICATION.confirmationStep.token')}
                            value={token}
                            onChange={onTokenFieldChange}
                        />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <InlineButton onClick={onPhoneEdit}>
                            {localize(i18n, 'task.PHONE_VERIFICATION.resendVerificationCode')}
                        </InlineButton>
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <Separator />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12} className={taskFormStyles.formButtons}>
                        {onBack && <TaskBackButton onClick={onBack} />}
                        <Button type="submit" className={taskFormStyles.formSubmitButton}>
                            {localize(i18n, 'taskManager.task.goToNextStep')}
                        </Button>
                    </Cell>
                </div>
            </form>
        </div>
    );
};

export default React.memo(PhoneVerificationConfirmationStep);
