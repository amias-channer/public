import Button from 'frontend-core/dist/components/ui-trader3/button';
import Input from 'frontend-core/dist/components/ui-trader3/input';
import Select from 'frontend-core/dist/components/ui-trader3/select';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import validateRequiredFields from 'frontend-core/dist/services/form/validate-required-fields';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import formatDate from 'frontend-core/dist/utils/date/format-date';
import parseDate from 'frontend-core/dist/utils/date/parse-date';
import * as React from 'react';
import {DocumentScannerResult, MrzInfo} from '../../../models/fourthline';
import {TaskStatusInformation} from '../../../models/private-onboarding-kyc-task';
import {maxDateOfBirthYear, maxDateOfExpirationYear, minDateOfBirthYear} from '../../../models/task';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import GenderSelector from '../../gender-selector/index';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import InputDate from '../../input-date';
import Separator from '../../separator';
import uploadIdDocument from '../../../services/private-onboarding-kyc-task/upload-id-document';
import useFormError from '../../task-form/hooks/use-form-error';
import useCountryValues from '../../task-form/hooks/use-country-values';
import useFormInputChangeHandler from '../../task-form/hooks/use-form-input-change-handler';
import useFormInputDateChangeHandler from '../../task-form/hooks/use-form-input-date-change-handler';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    documentIssuingCountry?: string;
    documentScannerResult: Partial<DocumentScannerResult>;
    onError(): void;
    onSubmit(taskStatusInformation: TaskStatusInformation): void;
}
const requiredFields: (keyof MrzInfo)[] = [
    'documentNumber',
    'expirationDate',
    'firstName',
    'lastName',
    'birthDate',
    'nationality',
    'gender'
];
const {useContext, useState, useEffect} = React;
const IdUploadEditingStep: React.FunctionComponent<Props> = ({
    task,
    documentScannerResult,
    documentIssuingCountry,
    onSubmit,
    onError
}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const app = useContext(AppApiContext);
    const countryValues = useCountryValues();
    const i18nTranslationCode = `task.${task.taskType}.ID_UPLOAD_EDITING`;
    const [stateError, setStateError] = useState<AppError | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const formError: AppError | undefined = useFormError(stateError);
    const [formData, setFormData] = useStateFromProp<Partial<MrzInfo> | undefined, Partial<MrzInfo>>(
        documentScannerResult.mrzInfo,
        (mrzInfo) => ({
            documentNumber: undefined,
            expirationDate: undefined,
            firstName: undefined,
            lastName: undefined,
            birthDate: undefined,
            nationality: undefined,
            gender: undefined,
            ...mrzInfo
        })
    );
    const onFormInputChange = useFormInputChangeHandler(setFormData);
    const onInputDateChange = useFormInputDateChangeHandler(setFormData);
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formDataValues = {
            ...formData,
            ...getFormData(event.currentTarget, {keepOriginValue: true})
        };
        const error: AppError | undefined = validateRequiredFields(formDataValues, requiredFields);

        if (error) {
            setStateError(error);
            return;
        }

        if (documentIssuingCountry && formDataValues.nationality !== documentIssuingCountry) {
            onError();
            return;
        }

        setIsSubmitting(true);
        setFormData(formDataValues);
        setStateError(undefined);

        const scannerResult = {
            ...documentScannerResult,
            mrzInfo: {
                ...formDataValues
            }
        } as DocumentScannerResult;

        uploadIdDocument(config, task, scannerResult)
            .then(onSubmit)
            .catch(setStateError)
            .finally(() => {
                setIsSubmitting(false);
            });
    };
    const fieldErrors: FieldErrors = (formError && getFieldErrors(formError)) || {};
    // [CLM-2790] idNumber validation error from BE side
    const idNumberError: AppError | undefined = fieldErrors.documentNumber || fieldErrors['idUploadDocument.idNumber'];

    useEffect(() => {
        if (formError && !Object.keys(fieldErrors).length && !idNumberError) {
            app.openErrorModal(formError);
        }
    }, [formError, app, idNumberError, fieldErrors]);

    const birthDate: Date | undefined = formData.birthDate
        ? parseDate(formData.birthDate, {keepOriginDate: true})
        : undefined;
    const expirationDate: Date | undefined = formData.expirationDate
        ? parseDate(formData.expirationDate, {keepOriginDate: true})
        : undefined;
    const maxYearOfExpirationDate: number | undefined =
        formData.nationality === 'ES' ? maxDateOfExpirationYear : undefined;

    return (
        <div data-name="editIdUploadStep">
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            {isSubmitting ? (
                <Spinner local={true} />
            ) : (
                <form method="POST" autoComplete="off" className={taskFormStyles.form} onSubmit={onSubmitForm}>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Input
                                name="firstName"
                                error={localizeError(i18n, fieldErrors.firstName)}
                                required={true}
                                label={localize(i18n, 'taskManager.task.taskForm.firstName')}
                                placeholder={localize(i18n, 'taskManager.task.taskForm.firstName')}
                                value={formData.firstName}
                                onChange={onFormInputChange}
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
                                value={formData.lastName}
                                onChange={onFormInputChange}
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Select
                                name="nationality"
                                error={localizeError(i18n, fieldErrors.nationality)}
                                required={true}
                                label={localize(i18n, 'taskManager.task.taskForm.nationalitySelect')}
                                value={formData.nationality}
                                values={countryValues}
                                onChange={onFormInputChange}
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <GenderSelector
                                value={formData.gender}
                                error={localizeError(i18n, fieldErrors.gender)}
                                required={true}
                                addOptionAll={true}
                                name="gender"
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <InputDate
                                name="birthDate"
                                id="birthDate"
                                required={true}
                                minYear={minDateOfBirthYear}
                                maxYear={maxDateOfBirthYear}
                                error={localizeError(i18n, fieldErrors.birthDate)}
                                label={localize(i18n, 'taskManager.task.taskForm.dateOfBirth')}
                                value={birthDate && formatDate(birthDate, 'YYYY-MM-DD')}
                                onChange={onInputDateChange}
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Input
                                name="documentNumber"
                                error={localizeError(i18n, idNumberError)}
                                required={true}
                                label={localize(i18n, 'taskManager.task.taskForm.documentNumber')}
                                placeholder={localize(i18n, 'taskManager.task.taskForm.documentNumber')}
                                value={formData.documentNumber}
                                onChange={onFormInputChange}
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <InputDate
                                name="expirationDate"
                                id="expirationDate"
                                required={true}
                                maxYear={maxYearOfExpirationDate}
                                error={localizeError(i18n, fieldErrors.expirationDate)}
                                label={localize(i18n, 'taskManager.task.taskForm.dateOfExpiration')}
                                value={expirationDate && formatDate(expirationDate, 'YYYY-MM-DD')}
                                onChange={onInputDateChange}
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

export default React.memo(IdUploadEditingStep);
