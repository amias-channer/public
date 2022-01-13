import Button from 'frontend-core/dist/components/ui-trader3/button';
import Radio from 'frontend-core/dist/components/ui-trader3/radio';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import {
    AdditionalQuestionsFields,
    additionalQuestionsFields,
    PersonInformationUsPersonData,
    UsPersonInformation
} from '../../models/private-onboarding-information-task';
import {UsPersonStepData} from '../../models/private-onboarding-kyc-task';
import validateUsPersonInformationStepData from '../../services/private-onboarding-information-task/validate-us-person-information-step-data';
import {I18nContext} from '../app-component/app-context';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import Separator from '../separator';
import useFormError from './hooks/use-form-error';
import prepareFormValue from './prepare-form-value';
import TaskBackButton from './task-back-button';
import TaskDescription from './task-description';
import * as taskFormStyles from './task-form.css';
import TaskTitle from './task-title';

function isAdditionalQuestionNeeded(questionIndex: number, formData: PersonInformationUsPersonData) {
    for (let i = 0; i < questionIndex; i++) {
        const questionField = additionalQuestionsFields[i];
        const additionalQuestionAnswer = formData[questionField];

        if (typeof additionalQuestionAnswer !== 'boolean' || additionalQuestionAnswer) {
            return false;
        }
    }
    return true;
}

const additionalQuestionsTranslationKeys: string[] = [
    'task.PRIVATE_ONBOARDING_INFORMATION.usPerson.additionalQuestionBirthPlace',
    'task.PRIVATE_ONBOARDING_INFORMATION.usPerson.additionalQuestionParents',
    'task.PRIVATE_ONBOARDING_INFORMATION.usPerson.additionalQuestionPassport',
    'task.PRIVATE_ONBOARDING_INFORMATION.usPerson.additionalQuestionCitizenship',
    'task.PRIVATE_ONBOARDING_INFORMATION.usPerson.additionalQuestionResidencePermit',
    'task.PRIVATE_ONBOARDING_INFORMATION.usPerson.additionalQuestionSubstantialPresence',
    'task.PRIVATE_ONBOARDING_INFORMATION.usPerson.additionalQuestionOtherReason'
];

interface Props {
    task: Task;
    usPersonInformation?: UsPersonInformation;
    onBack(): void;
    onSubmit(usPersonData: UsPersonStepData): void;
}

const {useContext, useState, useCallback} = React;
const UsPersonInformationStepForm: React.FunctionComponent<Props> = ({task, onSubmit, onBack, usPersonInformation}) => {
    const i18n = useContext(I18nContext);
    const i18nTranslationCode = `task.${task.taskType}.usPerson`;
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const [formData, setFormData] = useStateFromProp<UsPersonInformation | undefined, PersonInformationUsPersonData>(
        usPersonInformation,
        (usPersonInformation) => ({
            isUsPerson: false,
            isBirthPlaceQuestionApproved: undefined,
            isParentsQuestionApproved: undefined,
            isPassportQuestionApproved: undefined,
            isCitizenshipQuestionApproved: undefined,
            isResidencePermitQuestionApproved: undefined,
            isSubstantialPresenceQuestionApproved: undefined,
            isOtherReasonQuestionApproved: undefined,
            ...usPersonInformation
        })
    );
    const formError: AppError | undefined = useFormError(submissionError);
    const fieldErrors: FieldErrors = (formError && getFieldErrors(formError)) || {};
    const onFormInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const el = event.currentTarget;
        const {name} = el;
        const value = Boolean(prepareFormValue(el));
        const questionIndex: number = additionalQuestionsFields.indexOf(name as AdditionalQuestionsFields);

        setFormData((formData) => {
            if (questionIndex !== -1 && formData[name] === true) {
                for (let i = questionIndex + 1; i < additionalQuestionsFields.length; i++) {
                    formData[additionalQuestionsFields[i]] = undefined;
                }
            } else if (name === 'isUsPerson' && !value) {
                for (const questionField of additionalQuestionsFields) {
                    formData[questionField] = undefined;
                }
            }
            return {...formData, [name]: value};
        });
    }, []);
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataValues: PersonInformationUsPersonData = {
            ...formData,
            ...getFormData(event.currentTarget, {keepOriginValue: true})
        };
        const error: AppError | undefined = validateUsPersonInformationStepData(formDataValues);

        if (error) {
            setSubmissionError(error);
            return;
        }

        let approvedQuestionField: AdditionalQuestionsFields | undefined;

        if (formDataValues.isUsPerson) {
            approvedQuestionField = additionalQuestionsFields.find((questionField: AdditionalQuestionsFields) => {
                return Boolean(formData[questionField]);
            });
        }

        setSubmissionError(undefined);
        onSubmit({
            isUsPerson: Boolean(approvedQuestionField),
            approvedQuestionField
        });
    };

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            <form
                method="POST"
                data-name="personalInformationTaskUsPersonInfoForm"
                autoComplete="off"
                className={taskFormStyles.form}
                onSubmit={onSubmitForm}>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <Radio
                            name="isUsPerson"
                            checked={formData.isUsPerson === false}
                            data-value="false"
                            label={localize(i18n, `${i18nTranslationCode}.notUsPerson`)}
                            onChange={onFormInputChange}
                        />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <Radio
                            name="isUsPerson"
                            inlineLeft={true}
                            checked={formData.isUsPerson}
                            data-value="true"
                            label={localize(i18n, `${i18nTranslationCode}.mightBeUsPerson`)}
                            required={true}
                            error={localizeError(i18n, fieldErrors.isUsPerson)}
                            onChange={onFormInputChange}
                        />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12} />
                </div>
                {formData.isUsPerson &&
                    additionalQuestionsFields.map((formDataField: AdditionalQuestionsFields, index: number) => {
                        const additionalQuestionAnswer = formData[formDataField];

                        return (
                            isAdditionalQuestionNeeded(index, formData) && (
                                <div key={`additionalQuestion.${formDataField}`}>
                                    <div className={gridStyles.row}>
                                        <Cell size={12}>
                                            {localize(i18n, additionalQuestionsTranslationKeys[index])}
                                        </Cell>
                                    </div>
                                    <div className={gridStyles.row}>
                                        <Cell size={12}>
                                            <Radio
                                                name={formDataField}
                                                inlineLeft={true}
                                                checked={additionalQuestionAnswer}
                                                data-value="true"
                                                label={localize(i18n, 'taskManager.task.taskForm.answerYes')}
                                                required={true}
                                                onChange={onFormInputChange}
                                            />
                                            <Radio
                                                name={formDataField}
                                                checked={additionalQuestionAnswer === false}
                                                data-value="false"
                                                label={localize(i18n, 'taskManager.task.taskForm.answerNo')}
                                                onChange={onFormInputChange}
                                            />
                                        </Cell>
                                    </div>
                                </div>
                            )
                        );
                    })}
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
        </div>
    );
};

export default React.memo(UsPersonInformationStepForm);
