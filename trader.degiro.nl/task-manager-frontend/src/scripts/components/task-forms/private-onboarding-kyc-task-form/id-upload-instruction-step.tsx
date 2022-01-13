import Carousel, {Slide} from 'frontend-core/dist/components/ui-onboarding/carousel';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import requestCameraAuthorization from 'frontend-core/dist/platform/camera/request-camera-authorization';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import idCardSlide3ImgUrl from '../../../../images/svg/angle-id.svg';
import passportSlide2ImgUrl from '../../../../images/svg/angle-passport.svg';
import idCardSlide2ImgUrl from '../../../../images/svg/scanning-id-back.svg';
import idCardSlide1ImgUrl from '../../../../images/svg/scanning-id-front.svg';
import passportSlide1ImgUrl from '../../../../images/svg/scanning-passport.svg';
import {
    DocumentScannerParams,
    DocumentScannerResult,
    ScannerDocumentTypes,
    MrzValidationPolicies,
    ScannerImageDataTypes
} from '../../../models/fourthline';
import scanDocument from '../../../services/fourthline/document-scanner/scan-document';
import {AppApiContext, I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import useFormError from '../../task-form/hooks/use-form-error';
import TaskBackButton from '../../task-form/task-back-button';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    documentType: ScannerDocumentTypes;
    onBack(): void;
    onSubmit(documentScannerResult: DocumentScannerResult): void;
}

const {useContext, useState, useEffect, useCallback, useMemo} = React;
const IdUploadInstructionStep: React.FunctionComponent<Props> = ({task, onSubmit, onBack, documentType}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const {taskType} = task;
    const i18nTranslationCode = `task.${taskType}.ID_UPLOAD_INSTRUCTION`;
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionError, setSubmissionError] = useState<AppError | undefined>(undefined);
    const error: AppError | undefined = useFormError(submissionError);
    const slidesForIdCardOrPaperId = useMemo(
        () => [
            {
                title: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.ID_CARD}_front.title`),
                description: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.ID_CARD}_front.description`),
                imgUrl: idCardSlide1ImgUrl
            },
            {
                title: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.ID_CARD}_back.title`),
                description: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.ID_CARD}_back.description`),
                imgUrl: idCardSlide2ImgUrl
            },
            {
                title: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.ID_CARD}_angle.title`),
                description: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.ID_CARD}_angle.description`),
                imgUrl: idCardSlide3ImgUrl
            }
        ],
        [i18n]
    );
    const slidesByDocumentsType = useMemo<Record<ScannerDocumentTypes, Slide[]>>(
        () => ({
            [ScannerDocumentTypes.ID_CARD]: slidesForIdCardOrPaperId,
            [ScannerDocumentTypes.PAPER_ID]: slidesForIdCardOrPaperId,
            [ScannerDocumentTypes.PASSPORT]: [
                {
                    title: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.PASSPORT}.title`),
                    description: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.PASSPORT}.description`),
                    imgUrl: passportSlide1ImgUrl
                },
                {
                    title: localize(i18n, `${i18nTranslationCode}.${ScannerDocumentTypes.PASSPORT}_angle.title`),
                    description: localize(
                        i18n,
                        `${i18nTranslationCode}.${ScannerDocumentTypes.PASSPORT}_angle.description`
                    ),
                    imgUrl: passportSlide2ImgUrl
                }
            ]
        }),
        [i18n]
    );
    const goToNextStep = useCallback(() => {
        const documentScannerParams: DocumentScannerParams = {
            debugModeEnabled: false,
            shouldRecordVideo: true,
            includeAngledSteps: true,
            requestStepByStepConfirmation: true,
            documentType,
            mrzValidationPolicy: MrzValidationPolicies.NORMAL,
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
            .then(() => scanDocument(documentScannerParams))
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
                <div data-name="idUploadInstructionStep" className={taskFormStyles.form}>
                    <Carousel slides={slidesByDocumentsType[documentType]} />
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

export default React.memo(IdUploadInstructionStep);
