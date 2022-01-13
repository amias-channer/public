import Button from 'frontend-core/dist/components/ui-trader3/button';
import {inputFieldPrefix, inputFieldPrefixed} from 'frontend-core/dist/components/ui-trader3/input/input.css';
import Radio from 'frontend-core/dist/components/ui-trader3/radio';
import Select from 'frontend-core/dist/components/ui-trader3/select';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Country} from 'frontend-core/dist/models/country';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import {PhoneInformationStepData} from '../../models/phone-information';
import {PhoneCountryCodes} from '../../models/phone-verification-task';
import {TaskConfirmationMethods} from '../../models/task';
import getTaskFormVirtualPageLocation from '../../services/analytics/get-task-form-virtual-page-location';
import normalizePhoneNumber from '../../services/phone-verification-task/normalize-phone-number';
import validatePhoneVerificationStartStep from '../../services/phone-verification-task/validate-phone-verification-start-step';
import {I18nContext, MainClientContext} from '../app-component/app-context';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import InputNumber from '../input-number/index';
import Separator from '../separator';
import useCountryValues from './hooks/use-country-values';
import useFormError from './hooks/use-form-error';
import prepareFormValue from './prepare-form-value';
import TaskBackButton from './task-back-button';
import TaskDescription from './task-description';
import * as taskFormStyles from './task-form.css';
import TaskTitle from './task-title';

interface Props {
    task: Task;
    countries?: Country[];
    phoneCountryCodes: PhoneCountryCodes;
    phoneInformation?: Partial<PhoneInformationStepData>;
    hasConfirmationMethod?: boolean;
    taskDescriptionTranslationCode?: string;
    onBack?: () => void;
    onSubmit(phoneInformation: PhoneInformationStepData): void;
}

const {useContext, useState, useCallback, useEffect} = React;
const getPhoneCountryCode = (
    phoneCountryCodes: PhoneCountryCodes | undefined,
    country: string | undefined
): string | undefined => {
    return phoneCountryCodes && country && phoneCountryCodes[country];
};
const PhoneInformationStepForm: React.FunctionComponent<Props> = ({
    task,
    onSubmit,
    onBack,
    countries,
    phoneInformation,
    phoneCountryCodes,
    hasConfirmationMethod = true,
    taskDescriptionTranslationCode
}) => {
    const i18n = useContext(I18nContext);
    const {culture} = useContext(MainClientContext);
    const i18nTranslationCode = 'taskManager.phoneInformationStep';
    const countryValues = useCountryValues(countries);
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const defaultPhoneCountryCode: string | undefined = getPhoneCountryCode(phoneCountryCodes, culture);
    const [formData, setFormData] = useStateFromProp<
        Partial<PhoneInformationStepData> | undefined,
        PhoneInformationStepData
    >(phoneInformation, (phoneInformation) => ({
        country: phoneInformation?.country || culture,
        confirmationMethod: TaskConfirmationMethods.SMS,
        phoneNumber: {
            countryCode: phoneInformation?.phoneNumber?.countryCode || defaultPhoneCountryCode,
            nationalNumber: undefined,
            ...phoneInformation?.phoneNumber
        }
    }));
    const formError: AppError | undefined = useFormError(submissionError);
    const fieldErrors: FieldErrors = (formError && getFieldErrors(formError)) || {};
    const onConfirmationMethodChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            const value = prepareFormValue(event.currentTarget);

            setFormData({
                ...formData,
                confirmationMethod: value as TaskConfirmationMethods
            });
        },
        [formData]
    );
    const onPhoneNumberChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            const el = event.currentTarget;
            const value = String(prepareFormValue(el));
            const {phoneNumber} = formData;
            const phoneNationalNumber: string | undefined = value;
            const phoneCountryCode: string | undefined = phoneNumber && phoneNumber.countryCode;

            return setFormData({
                ...formData,
                phoneNumber: {
                    ...phoneNumber,
                    nationalNumber:
                        phoneNationalNumber && phoneCountryCode && phoneNationalNumber.indexOf(phoneCountryCode) === 0
                            ? phoneNationalNumber.slice(phoneCountryCode.length)
                            : phoneNationalNumber
                }
            });
        },
        [formData]
    );
    const onCountryChange = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
            const el = event.currentTarget;
            const value = String(prepareFormValue(el));
            const {phoneNumber} = formData;
            const phoneCountryCode: string | undefined = getPhoneCountryCode(phoneCountryCodes, value);

            setFormData({
                ...formData,
                country: value,
                confirmationMethod: TaskConfirmationMethods.SMS,
                phoneNumber: {
                    ...phoneNumber,
                    countryCode: phoneCountryCode
                }
            });
        },
        [formData]
    );
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataValues: PhoneInformationStepData = {
            ...formData,
            ...getFormData(event.currentTarget, {keepOriginValue: true})
        };
        const error: AppError | undefined = validatePhoneVerificationStartStep(formDataValues);

        if (error) {
            setSubmissionError(error);
            return;
        }

        const {phoneNumber} = formDataValues;

        setSubmissionError(undefined);
        onSubmit({
            ...formDataValues,
            phoneNumber: {
                countryCode: phoneNumber.countryCode,
                nationalNumber: phoneNumber.nationalNumber && normalizePhoneNumber(phoneNumber.nationalNumber)
            }
        });
    };

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {
            taskType: task.taskType,
            page: `${getTaskFormVirtualPageLocation(task)}/phone-information`
        });
    }, []);

    const {phoneNumber, confirmationMethod} = formData;
    const phoneCountryCode: string | undefined = phoneNumber && phoneNumber.countryCode;
    const phoneNumberLabel: string = localize(i18n, 'taskManager.phoneInformationStep.phoneNumber');

    return (
        <div data-name="phoneInformationStep">
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={taskDescriptionTranslationCode || `${i18nTranslationCode}.description`} />
            <form method="POST" autoComplete="off" className={taskFormStyles.form} onSubmit={onSubmitForm}>
                <div className={gridStyles.row}>
                    <Cell size={9} smallSize={4} mediumSize={6}>
                        <Select
                            name="country"
                            error={localizeError(i18n, fieldErrors.country)}
                            required={true}
                            disableFirstOption={true}
                            label={localize(i18n, 'taskManager.task.taskForm.countrySelect')}
                            value={formData.country}
                            values={countryValues}
                            onChange={onCountryChange}
                        />
                    </Cell>
                </div>
                {phoneCountryCode ? (
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <InputNumber
                                name="phoneNumber.nationalNumber"
                                autoFocus={true}
                                required={true}
                                error={localizeError(
                                    i18n,
                                    fieldErrors.phoneNumber ||
                                        fieldErrors['phoneNumber.nationalNumber'] ||
                                        fieldErrors['phoneNumber.countryCode']
                                )}
                                inputFieldPrefix={<span className={inputFieldPrefix}>{phoneCountryCode}</span>}
                                inputFieldClassName={inputFieldPrefixed}
                                label={phoneNumberLabel}
                                placeholder={phoneNumberLabel}
                                value={phoneNumber && phoneNumber.nationalNumber}
                                onChange={onPhoneNumberChange}
                            />
                        </Cell>
                    </div>
                ) : null}
                {hasConfirmationMethod ? (
                    <div className={gridStyles.row}>
                        <Cell size={12}>
                            <Radio
                                name="confirmationMethod"
                                error={localizeError(i18n, fieldErrors.confirmationMethod)}
                                inlineLeft={true}
                                checked={confirmationMethod === TaskConfirmationMethods.SMS}
                                required={true}
                                value={TaskConfirmationMethods.SMS}
                                data-value={TaskConfirmationMethods.SMS}
                                label={localize(i18n, 'task.PHONE_VERIFICATION.startStep.verifyBySms')}
                                onChange={onConfirmationMethodChange}
                            />
                        </Cell>
                        <Cell size={12}>
                            <Radio
                                name="confirmationMethod"
                                checked={confirmationMethod === TaskConfirmationMethods.CALL}
                                value={TaskConfirmationMethods.CALL}
                                data-value={TaskConfirmationMethods.CALL}
                                label={localize(i18n, 'task.PHONE_VERIFICATION.startStep.verifyByCall')}
                                onChange={onConfirmationMethodChange}
                            />
                        </Cell>
                    </div>
                ) : null}
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

export default React.memo(PhoneInformationStepForm);
