import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Nationality} from 'frontend-core/dist/models/country';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import hasFormError from 'frontend-core/dist/services/form/has-form-error';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import Radio from 'frontend-core/dist/components/ui-trader3/radio';
import Select from 'frontend-core/dist/components/ui-trader3/select';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {Task} from 'frontend-core/dist/models/task/task';
import localize from 'frontend-core/dist/services/i18n/localize';
import {CountryDocumentsRules} from '../../../models/upload-id-mifid-task';
import getDualNationalityInformation from '../../../services/private-onboarding-kyc-task/get-dual-nationality-information';
import saveDualNationalityInformation from '../../../services/private-onboarding-kyc-task/save-dual-nationality-information';
import isEUCountry from '../../../services/upload-id-mifid-task/is-eu-country';
import getDocumentsRules from '../../../services/upload-id-task/get-documents-rules';
import useFormError from '../../task-form/hooks/use-form-error';
import {DualNationalityInformation, DualNationalityUpdateResult} from '../../../models/private-onboarding-kyc-task';
import {AppApiContext, I18nContext, ConfigContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import prepareFormValue from '../../task-form/prepare-form-value';
import useNationalityValues from '../../task-form/hooks/use-nationality-values';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    onSubmit(dualNationalityResult: DualNationalityUpdateResult): void;
}

const {useContext, useEffect, useCallback, useState} = React;
const DualNationalitySelectStep: React.FunctionComponent<Props> = ({task, onSubmit}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const nationalityValues = useNationalityValues();
    const {taskType} = task;
    const i18nTranslationCode = `task.${taskType}.DUAL_NATIONALITY_SELECT`;
    const i18nPersonalInformationTranslationCode = `task.${task.taskType}.PERSONAL_INFORMATION_INSTRUCTION`;
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        isLoading: isCountryDocumentsRulesLoading,
        value: countryDocumentsRules,
        error: countryDocumentsRulesError
    } = useAsync<CountryDocumentsRules>(() => getDocumentsRules(config), [config]);
    const {
        isLoading: isDualNationalityInformationLoading,
        value: dualNationalityInformation,
        error: dualNationalityInformationError
    } = useAsync<DualNationalityInformation>(() => getDualNationalityInformation(config, task), [config, task]);
    const [formData, setFormData] = useStateFromProp<
        DualNationalityInformation | undefined,
        Partial<DualNationalityInformation>
    >(dualNationalityInformation, (dualNationalityInformationValue) => ({
        hasDualNationality: false,
        secondNationality: undefined,
        ...dualNationalityInformationValue
    }));
    const getSecondNationalityValues = (
        nationalities: Nationality[],
        countryDocumentsRules?: CountryDocumentsRules
    ): Nationality[] => {
        if (!countryDocumentsRules) {
            return [];
        }

        return nationalities.filter(({id}: Nationality) => {
            return isEUCountry(id, countryDocumentsRules);
        });
    };
    const secondNationalityValues = getSecondNationalityValues(nationalityValues, countryDocumentsRules);
    const onHasDualNationalityChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const hasDualNationality = Boolean(prepareFormValue(event.currentTarget));
            const secondValue: Nationality | undefined = secondNationalityValues?.[1];

            setFormData((formData) => ({
                ...formData,
                hasDualNationality,
                secondNationality: hasDualNationality && secondValue ? secondValue.id : undefined
            }));
        },
        [secondNationalityValues]
    );
    const onChangeSecondNationality = useCallback((event: React.FormEvent<HTMLSelectElement>) => {
        setFormData((formData: Partial<DualNationalityInformation>) => ({
            ...formData,
            secondNationality: event.currentTarget.value
        }));
    }, []);
    const formError: AppError | undefined = useFormError(
        submissionError || countryDocumentsRulesError || dualNationalityInformationError
    );
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setSubmissionError(undefined);

        saveDualNationalityInformation(config, task, formData)
            .then(onSubmit)
            .catch(setSubmissionError)
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    useEffect(() => {
        if (formError && !hasFormError(formError, Object.keys(formData))) {
            app.openErrorModal(formError);
        }
    }, [formError]);

    const fieldErrors: FieldErrors = (formError && getFieldErrors(formError)) || {};

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nPersonalInformationTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nPersonalInformationTranslationCode}.description`} />
            {isSubmitting || isCountryDocumentsRulesLoading || isDualNationalityInformationLoading ? (
                <Spinner local={true} />
            ) : (
                <form
                    method="POST"
                    autoComplete="off"
                    data-name="dualNationalityStep"
                    className={taskFormStyles.form}
                    onSubmit={onSubmitForm}>
                    <div className={gridStyles.row}>
                        <div className={gridStyles.row}>
                            <Cell size={12}>
                                <strong>{localize(i18n, `${i18nTranslationCode}.title`)}</strong>
                            </Cell>
                            <Cell size={12}>{localize(i18n, `${i18nTranslationCode}.description`)}</Cell>
                        </div>
                        <Cell size={12}>
                            <Radio
                                name="hasDualNationality"
                                inlineLeft={true}
                                checked={formData.hasDualNationality}
                                label={localize(i18n, 'taskManager.task.taskForm.answerYes')}
                                data-value="true"
                                value="true"
                                onChange={onHasDualNationalityChange}
                            />
                            <Radio
                                name="hasDualNationality"
                                checked={!formData.hasDualNationality}
                                label={localize(i18n, 'taskManager.task.taskForm.answerNo')}
                                data-value="false"
                                value="false"
                                onChange={onHasDualNationalityChange}
                            />
                        </Cell>
                    </div>
                    {formData.hasDualNationality && (
                        <div className={gridStyles.row}>
                            <Cell size={9} smallSize={4} mediumSize={6}>
                                <Select
                                    name="secondNationality"
                                    error={localizeError(i18n, fieldErrors.secondNationality)}
                                    required={true}
                                    disableFirstOption={true}
                                    value={formData.secondNationality}
                                    label={localize(i18n, `${i18nTranslationCode}.dualNationalityLabel`)}
                                    values={secondNationalityValues}
                                    onChange={onChangeSecondNationality}
                                />
                            </Cell>
                        </div>
                    )}
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
            )}
        </div>
    );
};

export default React.memo(DualNationalitySelectStep);
