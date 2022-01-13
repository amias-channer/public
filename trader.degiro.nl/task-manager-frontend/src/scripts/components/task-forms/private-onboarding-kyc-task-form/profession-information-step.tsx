import Button from 'frontend-core/dist/components/ui-trader3/button';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import hasFormError from 'frontend-core/dist/services/form/has-form-error';
import hasTranslation from 'frontend-core/dist/services/i18n/has-translation';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import Input from 'frontend-core/dist/components/ui-trader3/input';
import Select from 'frontend-core/dist/components/ui-trader3/select';
import localize from 'frontend-core/dist/services/i18n/localize';
import {
    ProfessionInformation,
    ProfessionalCategory,
    TaskStatusInformation
} from '../../../models/private-onboarding-kyc-task';
import {Industry} from '../../../models/industry';
import getIndustries from '../../../services/private-onboarding-kyc-task/get-industries';
import getProfessionalCategories from '../../../services/private-onboarding-kyc-task/get-professional-categories';
import saveProfessionInformationStepData from '../../../services/private-onboarding-kyc-task/save-profession-information-step-data';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import Separator from '../../separator';
import useFormError from '../../task-form/hooks/use-form-error';
import * as gridStyles from '../../grid/grid.css';
import TaskBackButton from '../../task-form/task-back-button';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    onBack(): void;
    onSubmit(taskStatusInformation: TaskStatusInformation): void;
}

const {useContext, useEffect, useState, useCallback} = React;
const ProfessionInformationStep: React.FunctionComponent<Props> = ({task, onSubmit, onBack}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const app = useContext(AppApiContext);
    const i18nTranslationCode = `task.${task.taskType}.PROFESSIONAL_INFORMATION`;
    const taskDescriptionTranslationCode = `${i18nTranslationCode}.description`;
    const [professionalCategories, setProfessionalCategories] = useState<ProfessionalCategory[]>([]);
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [formData, setFormData] = useState<Partial<ProfessionInformation>>({
        professionalCategory: undefined,
        industry: undefined,
        profession: undefined
    });
    const [error, setError] = useState<AppError | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const loadIndustries = (professionalCategoryId: ProfessionalCategory['id']) => {
        setIsLoading(true);
        getIndustries(config, {professionalCategoryId})
            .then((industries: Industry[]) => {
                setIndustries(industries);
                setFormData((formData) => ({...formData, industry: industries[0]?.id}));
            })
            .catch(setError)
            .finally(() => {
                setIsLoading(false);
            });
    };
    const {isLoading: isProfessionalCategoryLoading, error: professionalCategoryError} = useAsync(
        () =>
            getProfessionalCategories(config).then((professionalCategories: ProfessionalCategory[]) => {
                const professionalCategoryId = professionalCategories[0]?.id;

                setProfessionalCategories(professionalCategories);
                setFormData((formData) => ({...formData, professionalCategory: professionalCategoryId}));

                if (professionalCategoryId) {
                    loadIndustries(professionalCategoryId);
                }
            }),
        [config, task]
    );
    const normalizedError: AppError | undefined = useFormError(error || professionalCategoryError);
    const onProfessionalCategorySelect = useCallback(
        (event: React.FormEvent<HTMLSelectElement>) => {
            const professionalCategoryId = event.currentTarget.value;

            setFormData((formData) => ({...formData, professionalCategory: professionalCategoryId}));
            loadIndustries(professionalCategoryId);
        },
        [setFormData]
    );
    const onIndustriesChange = useCallback(
        (event: React.FormEvent<HTMLSelectElement>) => {
            setFormData((formData) => ({...formData, industry: event.currentTarget.value}));
        },
        [setFormData]
    );
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataValues: Partial<ProfessionInformation> = {
            ...formData,
            ...getFormData(event.currentTarget, {keepOriginValue: true})
        };

        setIsLoading(true);
        setError(undefined);

        saveProfessionInformationStepData(config, task, formDataValues)
            .then(onSubmit)
            .catch(setError)
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (normalizedError && !hasFormError(normalizedError, Object.keys(formData))) {
            app.openErrorModal(normalizedError);
        }
    }, [normalizedError]);

    const fieldErrors: FieldErrors = (normalizedError && getFieldErrors(normalizedError)) || {};
    const i18nCode = 'task.FLATEX_ACCOUNT_OPENING.additionalInformationStep';
    const professionalCategoryLabel: string = localize(i18n, `${i18nCode}.professionalCategory.label`);
    const industryLabel: string = localize(i18n, `${i18nCode}.industry.label`);
    const professionLabel: string = localize(i18n, `${i18nCode}.profession.label`);
    const professionalCategoriesOptions = [{id: '', label: professionLabel}].concat(
        professionalCategories.map((professionalCategory) => ({
            id: professionalCategory.id,
            label: localize(i18n, professionalCategory.label)
        }))
    );
    const industriesOptions = [{id: '', label: industryLabel}].concat(
        industries.map((industry) => ({
            id: industry.id,
            label: localize(i18n, industry.label)
        }))
    );

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            {hasTranslation(i18n, taskDescriptionTranslationCode) && (
                <TaskDescription translationCode={taskDescriptionTranslationCode} />
            )}
            {isLoading || isProfessionalCategoryLoading ? (
                <Spinner local={true} />
            ) : (
                <form
                    method="POST"
                    autoComplete="off"
                    data-name="professionInformationStep"
                    className={taskFormStyles.form}
                    onSubmit={onSubmitForm}>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Select
                                name="professionalCategory"
                                error={localizeError(i18n, fieldErrors.professionalCategory)}
                                disabled={professionalCategoriesOptions.length < 2}
                                autoFocus={true}
                                required={true}
                                disableFirstOption={true}
                                label={professionalCategoryLabel}
                                value={formData.professionalCategory}
                                values={professionalCategoriesOptions}
                                onChange={onProfessionalCategorySelect}
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Select
                                name="industry"
                                disabled={industries.length < 2}
                                error={localizeError(i18n, fieldErrors.industry)}
                                autoFocus={true}
                                required={true}
                                disableFirstOption={true}
                                label={industryLabel}
                                value={formData.industry}
                                values={industriesOptions}
                                onChange={onIndustriesChange}
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Input
                                name="profession"
                                error={localizeError(i18n, fieldErrors.profession)}
                                required={true}
                                label={professionLabel}
                                placeholder={professionLabel}
                                value={formData.profession}
                            />
                        </Cell>
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

export default React.memo(ProfessionInformationStep);
