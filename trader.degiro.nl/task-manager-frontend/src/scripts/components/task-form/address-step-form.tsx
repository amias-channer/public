import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import Input from 'frontend-core/dist/components/ui-trader3/input/index';
import Select from 'frontend-core/dist/components/ui-trader3/select';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Country} from 'frontend-core/dist/models/country';
import {Task} from 'frontend-core/dist/models/task/task';
import {AddressInfo} from 'frontend-core/dist/models/user';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import validateRequiredFields from 'frontend-core/dist/services/form/validate-required-fields';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import getTaskFormVirtualPageLocation from '../../services/analytics/get-task-form-virtual-page-location';
import {AppApiContext, I18nContext, TasksInfoContext} from '../app-component/app-context';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import Separator from '../separator';
import SkipTaskLink from '../skip-task-link';
import useCountryValues from './hooks/use-country-values';
import useFormError from './hooks/use-form-error';
import useFormInputChangeHandler from './hooks/use-form-input-change-handler';
import TaskBackButton from './task-back-button';
import TaskDescription from './task-description';
import * as taskFormStyles from './task-form.css';
import TaskTitle from './task-title';

interface Props {
    task: Task;
    disabledFields?: Array<keyof AddressInfo>;
    addressInfo?: Partial<AddressInfo>;
    countries?: Country[];
    taskTitle?: string;
    error?: Error | AppError;
    taskDescriptionTranslationCode?: string;
    hasSkipTaskLink?: boolean;
    onBack(): void;
    onSubmit(addressInformation: Partial<AddressInfo>): void;
}

const {useContext, useEffect, useState, useCallback} = React;
const AddressStepForm: React.FunctionComponent<Props> = ({
    task,
    onSubmit,
    onBack,
    addressInfo,
    disabledFields = [],
    countries,
    taskTitle,
    taskDescriptionTranslationCode,
    hasSkipTaskLink = true,
    error
}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const {hasOverdueTask} = useContext(TasksInfoContext);
    const countryValues = useCountryValues(countries);
    const i18nTranslationCode = `task.${task.taskType}.address`;
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const [formData, setFormData] = useStateFromProp<Partial<AddressInfo> | undefined, Partial<AddressInfo>>(
        addressInfo,
        (addressInfo) => ({
            streetAddress: undefined,
            streetAddressNumber: undefined,
            streetAddressExt: undefined,
            zip: undefined,
            city: undefined,
            country: undefined,
            ...addressInfo
        })
    );
    const onFormInputChange = useFormInputChangeHandler(setFormData);
    const renderTaskDescriptionHint = useCallback(
        (hintTranslationCode: string): React.ReactElement => {
            return (
                <InnerHtml>
                    {localize(i18n, hintTranslationCode, {
                        countries: countryValues
                            .filter((country: Country) => country.id)
                            .map((country: Country) => country.label)
                            .join(', ')
                    })}
                </InnerHtml>
            );
        },
        [i18n, countryValues]
    );
    const formError: AppError | undefined = useFormError(submissionError || error);
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataValues: Partial<AddressInfo> = {
            ...formData,
            ...getFormData(event.currentTarget, {keepOriginValue: true})
        };
        const error: AppError | void = validateRequiredFields(formDataValues, [
            'streetAddress',
            'zip',
            'city',
            'country'
        ]);

        if (error) {
            setSubmissionError(error);
            return;
        }

        setSubmissionError(undefined);
        onSubmit(formDataValues);
    };
    const fieldErrors: FieldErrors = (formError && getFieldErrors(formError)) || {};

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {
            taskType: task.taskType,
            page: `${getTaskFormVirtualPageLocation(task)}/address-information`
        });
    }, []);

    useEffect(() => {
        if (formError && !Object.keys(fieldErrors).length) {
            app.openErrorModal(formError);
        }
    }, [formError, app, fieldErrors]);

    return (
        <div>
            <TaskTitle>{taskTitle || localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription
                renderHint={renderTaskDescriptionHint}
                translationCode={taskDescriptionTranslationCode || `${i18nTranslationCode}.description`}
            />
            <form
                method="POST"
                data-name="addressStepForm"
                autoComplete="off"
                className={taskFormStyles.form}
                onSubmit={onSubmitForm}>
                <div className={gridStyles.row}>
                    <Cell size={6} smallSize={3} mediumSize={4}>
                        <Input
                            name="streetAddress"
                            error={localizeError(i18n, fieldErrors.streetAddress)}
                            required={true}
                            label={localize(i18n, 'taskManager.task.taskForm.streetAddress')}
                            placeholder={localize(i18n, 'taskManager.task.taskForm.streetAddress')}
                            value={formData.streetAddress}
                            disabled={disabledFields.includes('streetAddress')}
                            onChange={onFormInputChange}
                        />
                    </Cell>
                    <Cell size={3} smallSize={1} mediumSize={2}>
                        <Input
                            name="streetAddressNumber"
                            error={localizeError(i18n, fieldErrors.streetAddressNumber)}
                            type="text"
                            label={localize(i18n, 'taskManager.task.taskForm.streetAddressNumber')}
                            placeholder={localize(i18n, 'taskManager.task.taskForm.streetAddressNumber')}
                            value={formData.streetAddressNumber}
                            disabled={disabledFields.includes('streetAddressNumber')}
                            onChange={onFormInputChange}
                        />
                    </Cell>
                    <Cell size={9} smallSize={4}>
                        <Input
                            name="streetAddressExt"
                            error={localizeError(i18n, fieldErrors.streetAddressExt)}
                            label={localize(i18n, 'taskManager.task.taskForm.streetAddressExt')}
                            placeholder={localize(i18n, 'taskManager.task.taskForm.streetAddressExt')}
                            value={formData.streetAddressExt}
                            disabled={disabledFields.includes('streetAddressExt')}
                            onChange={onFormInputChange}
                        />
                    </Cell>
                    <Cell size={6} smallSize={4} mediumSize={4}>
                        <Input
                            name="city"
                            error={localizeError(i18n, fieldErrors.city)}
                            required={true}
                            label={localize(i18n, 'taskManager.task.taskForm.city')}
                            placeholder={localize(i18n, 'taskManager.task.taskForm.city')}
                            value={formData.city}
                            disabled={disabledFields.includes('city')}
                            onChange={onFormInputChange}
                        />
                    </Cell>
                    <Cell size={3} smallSize={4} mediumSize={2}>
                        <Input
                            name="zip"
                            error={localizeError(i18n, fieldErrors.zip)}
                            required={true}
                            label={localize(i18n, 'taskManager.task.taskForm.zip')}
                            placeholder={localize(i18n, 'taskManager.task.taskForm.zip')}
                            value={formData.zip}
                            disabled={disabledFields.includes('zip')}
                            onChange={onFormInputChange}
                        />
                    </Cell>
                    <Cell size={9} smallSize={4}>
                        <Select
                            name="country"
                            error={localizeError(i18n, fieldErrors.country)}
                            required={true}
                            label={localize(i18n, 'taskManager.task.taskForm.countryOfResidence')}
                            value={formData.country}
                            values={countryValues}
                            disabled={disabledFields.includes('country')}
                            onChange={onFormInputChange}
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
                        {!hasOverdueTask && hasSkipTaskLink && (
                            <SkipTaskLink className={taskFormStyles.skipTaskLink} task={task} />
                        )}
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

export default React.memo(AddressStepForm);
