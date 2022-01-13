import Button from 'frontend-core/dist/components/ui-trader3/button';
import Input from 'frontend-core/dist/components/ui-trader3/input';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {BankAccountInfo} from 'frontend-core/dist/models/bank';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import {bankAccountFields} from '../../../models/bank-account-verification-task';
import getTaskFormVirtualPageLocation from '../../../services/analytics/get-task-form-virtual-page-location';
import normalizeIban from '../../../services/bank-account/normalize-iban';
import validateBankAccountData, {numericFields} from '../../../services/bank-account/validate-bank-account-data';
import {AppApiContext, I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import useFormError from '../hooks/use-form-error';
import useFormInputChangeHandler from '../hooks/use-form-input-change-handler';
import TaskBackButton from '../task-back-button';
import TaskDescription from '../task-description';
import * as taskFormStyles from '../task-form.css';
import TaskTitle from '../task-title';
import {ibanInput} from './bank-account-step-form.css';

interface Props {
    task: Task;
    bankAccount?: Partial<BankAccountInfo>;
    error?: AppError | Error;
    onBack?: () => void;
    onSubmit(bankAccount: Partial<BankAccountInfo>): void;
}

const {useContext, useEffect, useState} = React;
const BankAccountStepForm: React.FunctionComponent<Props> = ({task, onSubmit, error, onBack, bankAccount = {}}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const i18nTranslationCode = `task.${task.taskType}.bankAccount`;
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const [formData, setFormData] = useStateFromProp<Partial<BankAccountInfo>>(bankAccount);
    const onFormInputChange = useFormInputChangeHandler(setFormData);
    const formError: AppError | undefined = useFormError(submissionError || error);
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataValues: Partial<BankAccountInfo> = {
            ...formData,
            ...getFormData(event.currentTarget, {keepOriginValue: true})
        };
        const error: AppError | undefined = validateBankAccountData(formData);

        if (error) {
            setSubmissionError(error);
            return;
        }

        if (formDataValues.iban != null) {
            formDataValues.iban = normalizeIban(formDataValues.iban);
        }

        setSubmissionError(undefined);
        onSubmit(formDataValues);
    };
    const fieldErrors: FieldErrors = (formError && getFieldErrors(formError)) || {};

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {
            taskType: task.taskType,
            page: `${getTaskFormVirtualPageLocation(task)}/bank-account`
        });
    }, []);

    useEffect(() => {
        if (formError && !Object.keys(fieldErrors).length) {
            app.openErrorModal(formError);
        }
    }, [formError, app, fieldErrors]);

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            <form
                method="POST"
                data-name="bankAccountStepForm"
                autoComplete="off"
                className={taskFormStyles.form}
                onSubmit={onSubmitForm}>
                {bankAccountFields.map((field: string) => {
                    const fieldValue: string | void = (formData as {[key: string]: any})[field];

                    if (fieldValue == null) {
                        return null;
                    }

                    const label: string = localize(i18n, `task.BANK_ACCOUNT_VERIFICATION.bankAccount.${field}.label`);

                    return (
                        <div key={field} className={gridStyles.row}>
                            <Cell size={9} smallSize={4} mediumSize={6}>
                                <Input
                                    name={field}
                                    inputFieldClassName={field === 'iban' ? ibanInput : ''}
                                    type={numericFields.includes(field) ? 'tel' : 'text'}
                                    error={localizeError(i18n, fieldErrors[field])}
                                    required={true}
                                    label={label}
                                    placeholder={label}
                                    value={fieldValue as string}
                                    onChange={onFormInputChange}
                                />
                            </Cell>
                        </div>
                    );
                })}
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

export default React.memo(BankAccountStepForm);
