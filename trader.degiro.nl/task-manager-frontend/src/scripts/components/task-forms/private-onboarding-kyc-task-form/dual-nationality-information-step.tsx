import Button from 'frontend-core/dist/components/ui-trader3/button';
import Input from 'frontend-core/dist/components/ui-trader3/input';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getFieldError from 'frontend-core/dist/services/app-error/get-field-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import {
    DocumentTypes,
    IdMifidNumber,
    IdNumber,
    MifidIdNumber,
    MifidIdNumberData,
    TaskStatusInformation
} from '../../../models/private-onboarding-kyc-task';
import getIdMifidNumber from '../../../services/private-onboarding-kyc-task/get-id-mifid-number';
import saveIdMifidNumber from '../../../services/private-onboarding-kyc-task/save-id-mifid-number';
import skipIdMifidNumber from '../../../services/private-onboarding-kyc-task/skip-id-mifid-number';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import useFormError from '../../task-form/hooks/use-form-error';
import TaskBackButton from '../../task-form/task-back-button';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';
import {skipIdDocumentButton} from '../upload-id-mifid-task-form/additional-id-data-step-form/additional-id-data-step-form.css';

interface IdNumberInfo extends IdNumber {
    documentType?: DocumentTypes;
}

interface Props {
    task: Task;
    onBack(): void;
    mifidIdNumberData: MifidIdNumberData;
    onSubmit(taskStatusInformation: TaskStatusInformation): void;
}

const {useContext, useEffect, useState, useCallback} = React;
const DualNationalityInformationStep: React.FunctionComponent<Props> = ({
    task,
    onSubmit,
    mifidIdNumberData,
    onBack
}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const app = useContext(AppApiContext);
    const i18nTranslationCode = `task.${task.taskType}.DUAL_NATIONALITY_INFORMATION`;
    const [idNumberValue, setIdNumberValue] = useState<string | undefined>(undefined);
    const [skippedMifidIdNumberNames, setSkippedMifidIdNumberNames] = useState<string[]>([]);
    const [idNumber, setIdNumber] = useState<IdNumberInfo | undefined>(undefined);
    const [stateError, setStateError] = useState<AppError | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {isLoading: isIdMifidNumberLoading, error: idMifidNumberError} = useAsync(async () => {
        const idMifidNumber: IdMifidNumber = await getIdMifidNumber(config, task);
        const [firstMifidIdNumber] = mifidIdNumberData.mifidIdNumbers;
        const {idNumber} = idMifidNumber;
        const idNumberValue: string = idNumber?.value || '';
        const idNumberName: string = idNumber?.name || firstMifidIdNumber.name;

        setIdNumberValue(idNumberValue);
        setIdNumber({
            name: idNumberName,
            value: idNumberValue,
            documentType: firstMifidIdNumber.documentType
        });
    }, [config, task]);
    const formError: AppError | undefined = useFormError(stateError || idMifidNumberError);
    const idNumberError: AppError | undefined = formError && getFieldError(formError, 'idNumber.value');
    const onIdNumberValueChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
        setIdNumberValue(event.currentTarget.value);
    }, []);
    const onSkipIdDocument = (idNumber: IdNumberInfo) => {
        const {mifidIdNumbers, canSkipAllIdNumbers} = mifidIdNumberData;
        const [firstMifidIdNumber] = mifidIdNumbers;
        const idNumberName: string = idNumber.name;
        const nextMifidIdNumber: MifidIdNumber | undefined = mifidIdNumbers.find((_, index: number) => {
            return index > 0 && mifidIdNumbers[index - 1].name === idNumberName;
        });
        const nextIdNumberName: string | undefined = nextMifidIdNumber?.name;
        const nextIdNumberDocumentType: DocumentTypes | undefined = nextMifidIdNumber?.documentType;
        const nextIdNumber: IdNumber | undefined = nextIdNumberName ? {name: nextIdNumberName, value: ''} : undefined;

        if (nextIdNumber) {
            setSkippedMifidIdNumberNames([...skippedMifidIdNumberNames, idNumberName]);
            setIdNumber({...nextIdNumber, documentType: nextIdNumberDocumentType});
            setIdNumberValue(nextIdNumber.value);
            return;
        }

        // if `canSkipAllIdNumbers` is true then after showing to a client all the possible options skip-id-mifid-number
        if (canSkipAllIdNumbers) {
            setIsLoading(true);

            skipIdMifidNumber(config, task)
                .then(onSubmit)
                .catch(setStateError)
                .finally(() => setIsLoading(false));
            return;
        }

        // if `canSkipAllIdNumbers` is false then for the last time (no more options to show),
        // show the first option from the mifidIdNumbers again
        setSkippedMifidIdNumberNames([]);
        setIdNumber({value: '', name: firstMifidIdNumber.name, documentType: firstMifidIdNumber.documentType});
        setIdNumberValue(undefined);
    };
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoading(true);
        setStateError(undefined);

        saveIdMifidNumber(config, task, {
            nationality: mifidIdNumberData.mifidNationality,
            idNumber: {
                name: idNumber?.name || '',
                value: idNumberValue || ''
            }
        })
            .then(onSubmit)
            .catch(setStateError)
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (formError && !idNumberError) {
            app.openErrorModal(formError);
        }
    }, [app, formError, idNumberError]);

    const {mifidIdNumbers} = mifidIdNumberData;
    const IdNumberLabel: string | undefined = idNumber?.documentType
        ? localize(i18n, `taskManager.task.taskForm.documentType.${idNumber.documentType}.number`)
        : idNumber?.name;
    const skipIdDocumentLabel: string = localize(i18n, 'task.ID_UPLOAD_MIFID.skipIdNumber');

    return (
        <div data-name="nationalityInformationStep">
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            {isLoading || isIdMifidNumberLoading ? (
                <Spinner local={true} />
            ) : (
                <form method="POST" autoComplete="off" className={taskFormStyles.form} onSubmit={onSubmitForm}>
                    {idNumber && (
                        <>
                            <div className={gridStyles.row}>
                                <Cell size={9} smallSize={4} mediumSize={6}>
                                    <Input
                                        name="idNumberValue"
                                        required={true}
                                        data-name={IdNumberLabel}
                                        error={localizeError(i18n, idNumberError)}
                                        label={IdNumberLabel}
                                        placeholder={IdNumberLabel}
                                        value={idNumberValue}
                                        onChange={onIdNumberValueChange}
                                    />
                                </Cell>
                            </div>
                            {(mifidIdNumberData.canSkipAllIdNumbers || mifidIdNumbers.length > 1) && (
                                <div className={gridStyles.row}>
                                    <Cell size={9} smallSize={4} mediumSize={6}>
                                        <button
                                            name="skipIdDocumentButton"
                                            type="button"
                                            title={skipIdDocumentLabel}
                                            className={skipIdDocumentButton}
                                            onClick={onSkipIdDocument.bind(null, idNumber)}>
                                            {skipIdDocumentLabel}
                                        </button>
                                    </Cell>
                                </div>
                            )}
                            <div className={gridStyles.row}>
                                <Cell size={12}>
                                    <Separator />
                                </Cell>
                            </div>
                        </>
                    )}
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

export default React.memo(DualNationalityInformationStep);
