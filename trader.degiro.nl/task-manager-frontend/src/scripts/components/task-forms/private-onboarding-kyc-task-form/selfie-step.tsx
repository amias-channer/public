import Button from 'frontend-core/dist/components/ui-trader3/button';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {I18n} from 'frontend-core/dist/models/i18n';
import {Task} from 'frontend-core/dist/models/task/task';
import requestCameraAuthorization from 'frontend-core/dist/platform/camera/request-camera-authorization';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import selfieImgUrl from '../../../../images/svg/selfie.svg';
import {
    ErrorDescriptionLabels,
    LivenessCheckTypes,
    ScannerImageDataTypes,
    SelfieScannerErrorCodes,
    SelfieScannerParams,
    SelfieScannerResult
} from '../../../models/fourthline';
import {TaskStatusInformation} from '../../../models/private-onboarding-kyc-task';
import scanSelfie from '../../../services/fourthline/selfie-scanner/scan-selfie';
import uploadSelfie from '../../../services/private-onboarding-kyc-task/upload-selfie';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import useFormError from '../../task-form/hooks/use-form-error';
import TaskBackButton from '../../task-form/task-back-button';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';
import {onboardingKycStepImg} from './private-onboarding-kyc-task-form.css';

interface Props {
    task: Task;
    onBack(): void;
    onSubmit(taskStatusInformation: TaskStatusInformation): void;
}

const getCustomErrorDescriptionLabels = (
    i18n: I18n,
    {taskType}: Task
): ErrorDescriptionLabels<SelfieScannerErrorCodes> => ({
    [SelfieScannerErrorCodes.SCANNER_TIMEOUT]: localize(
        i18n,
        `task.${taskType}.SELFIE.selfieScannerError.SCANNER_TIMEOUT`
    )
});
const {useContext, useState, useEffect, useCallback} = React;
const SelfieStep: React.FunctionComponent<Props> = ({task, onSubmit, onBack}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const {taskType} = task;
    const i18nTranslationCode = `task.${taskType}.SELFIE`;
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const error: AppError | undefined = useFormError(submissionError);
    const goToNextStep = useCallback(() => {
        const selfieScannerParams: SelfieScannerParams = {
            debugModeEnabled: false,
            shouldRecordVideo: true,
            includeManualSelfiePolicy: false,
            livenessCheckType: LivenessCheckTypes.HEAD_TURN,
            returnImagesAs: ScannerImageDataTypes.BASE64
        };

        setIsSubmitting(true);
        setSubmissionError(undefined);

        requestCameraAuthorization()
            .catch((error: Error | AppError) => {
                logErrorLocally(error);
                logErrorRemotely(error);
                throw new AppError({
                    text: localize(i18n, `task.${taskType}.SCAN_DOCUMENT.errors.noCameraPermissions`)
                });
            })
            .then(() => scanSelfie(selfieScannerParams, getCustomErrorDescriptionLabels(i18n, task)))
            .then((selfieScannerResult: SelfieScannerResult) => uploadSelfie(config, task, selfieScannerResult))
            .then(onSubmit)
            .catch(setSubmissionError)
            .finally(() => {
                setIsSubmitting(false);
            });
    }, []);

    useEffect(() => {
        if (error) {
            app.openErrorModal(error);
        }
    }, [error]);

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            {isSubmitting ? (
                <Spinner local={true} />
            ) : (
                <div data-name="selfieStep" className={taskFormStyles.form}>
                    <div className={gridStyles.row}>
                        <Cell size={12} align="center">
                            <img src={selfieImgUrl} width={150} height={180} className={onboardingKycStepImg} alt="" />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={12} smallSize={4} mediumSize={6}>
                            {localize(i18n, `task.${taskType}.SELFIE_INSTRUCTION.description`)}
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
                            <Button type="button" className={taskFormStyles.formSubmitButton} onClick={goToNextStep}>
                                {localize(i18n, 'taskManager.task.goToNextStep')}
                            </Button>
                        </Cell>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(SelfieStep);
