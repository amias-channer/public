import Button from 'frontend-core/dist/components/ui-trader3/button';
import Input from 'frontend-core/dist/components/ui-trader3/input/index';
import Select from 'frontend-core/dist/components/ui-trader3/select';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import hasFormError from 'frontend-core/dist/services/form/has-form-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import savePlaceOfBirthInformation from '../../../services/private-onboarding-kyc-task/save-place-of-birth-information';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import {PlaceOfBirthInformation, TaskStatusInformation} from '../../../models/private-onboarding-kyc-task';
import Separator from '../../separator';
import useFormError from '../../task-form/hooks/use-form-error';
import useCountryValues from '../../task-form/hooks/use-country-values';
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
const PlaceOfBirthInformationStep: React.FunctionComponent<Props> = ({task, onSubmit, onBack}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const app = useContext(AppApiContext);
    const countryValues = useCountryValues();
    const i18nTranslationCode = `task.${task.taskType}.BIRTH_DATA`;
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<PlaceOfBirthInformation>>({
        placeOfBirth: undefined,
        countryOfBirth: undefined
    });
    const error: AppError | undefined = useFormError(submissionError);
    const onChangeCountry = useCallback((event: React.FormEvent<HTMLSelectElement>) => {
        setFormData((formData) => ({...formData, countryOfBirth: event.currentTarget.value}));
    }, []);
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataValues: Partial<PlaceOfBirthInformation> = {
            ...formData,
            ...getFormData(event.currentTarget, {keepOriginValue: true})
        };

        setIsSubmitting(true);
        setSubmissionError(undefined);

        savePlaceOfBirthInformation(config, task, formDataValues)
            .then(onSubmit)
            .catch(setSubmissionError)
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    useEffect(() => {
        if (error && !hasFormError(error, Object.keys(formData))) {
            app.openErrorModal(error);
        }
    }, [error]);

    const fieldErrors: FieldErrors = (error && getFieldErrors(error)) || {};

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            {isSubmitting ? (
                <Spinner local={true} />
            ) : (
                <form
                    method="POST"
                    autoComplete="off"
                    data-name="placeOfBirthInformationStep"
                    className={taskFormStyles.form}
                    onSubmit={onSubmitForm}>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Input
                                name="placeOfBirth"
                                error={localizeError(i18n, fieldErrors.placeOfBirth)}
                                required={true}
                                label={localize(i18n, 'taskManager.task.taskForm.placeOfBirth')}
                                placeholder={localize(i18n, 'taskManager.task.taskForm.placeOfBirth')}
                                value={formData.placeOfBirth}
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Select
                                name="countryOfBirth"
                                error={localizeError(i18n, fieldErrors.countryOfBirth)}
                                required={true}
                                label={localize(i18n, 'taskManager.task.taskForm.countryOfBirth')}
                                value={formData.countryOfBirth}
                                values={countryValues}
                                onChange={onChangeCountry}
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

export default React.memo(PlaceOfBirthInformationStep);
