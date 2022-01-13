import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import AppLinks from 'frontend-core/dist/components/ui-onboarding/app-links';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError} from 'frontend-core/dist/models/app-error';
import {BankAccountInfo} from 'frontend-core/dist/models/bank';
import {Country} from 'frontend-core/dist/models/country';
import {AddressInfo} from 'frontend-core/dist/models/user';
import isCameraPluginSupported from 'frontend-core/dist/platform/camera/is-camera-plugin-supported';
import isGeolocationPluginSupported from 'frontend-core/dist/platform/geolocation/is-geolocation-plugin-supported';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import isRequestTimeoutError from 'frontend-core/dist/services/app-error/is-request-timeout-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import logout from 'frontend-core/dist/services/user/logout';
import redirectToLoginPage from 'frontend-core/dist/services/user/redirect-to-login-page';
import * as React from 'react';
import {DocumentScannerResult, ScannerDocumentTypes, GeolocationCoordinates} from '../../../models/fourthline';
import {PhoneInformationStepData} from '../../../models/phone-information';
import {
    PhoneCountryCodes,
    PhoneVerificationConfirmationData,
    PhoneVerificationStartResult
} from '../../../models/phone-verification-task';
import {
    PrivateOnboardingBankAccountInfo,
    UsPersonInformation
} from '../../../models/private-onboarding-information-task';
import {
    CountryInformation,
    DocumentTypeInformation,
    DualNationalityUpdateResult,
    IdUploadDocumentScannerResult,
    MifidIdNumberData,
    PrivateOnboardingKycTaskSteps,
    TaskStatus,
    TaskStatusInformation,
    UsPersonStepData
} from '../../../models/private-onboarding-kyc-task';
import isFourthlineScannerSupported from '../../../services/fourthline/is-fourthline-scanner-supported';
import confirmPhoneVerification from '../../../services/private-onboarding-kyc-task/complete-phone-verification';
import getAddressInformation from '../../../services/private-onboarding-kyc-task/get-address-information';
import getBankAccountStepData from '../../../services/private-onboarding-kyc-task/get-bank-account-step-data';
import getIdDocumentScannerResult from '../../../services/private-onboarding-kyc-task/get-id-document-scanner-result';
import getTaskPrevStep from '../../../services/private-onboarding-kyc-task/get-task-prev-step';
import getTaskStatusInformation from '../../../services/private-onboarding-kyc-task/get-task-status-information';
import getUsPersonStepData from '../../../services/private-onboarding-kyc-task/get-us-person-step-data';
import saveAddressInformation from '../../../services/private-onboarding-kyc-task/save-address-information';
import saveBankAccountStepData from '../../../services/private-onboarding-kyc-task/save-bank-account-step-data';
import saveUsPersonStepData from '../../../services/private-onboarding-kyc-task/save-us-person-step-data';
import skipNfc from '../../../services/private-onboarding-kyc-task/skip-nfc';
import uploadIdDocument from '../../../services/private-onboarding-kyc-task/upload-id-document';
import waitTaskSettledStatus from '../../../services/private-onboarding-kyc-task/wait-task-settled-status';
import startPhoneVerification from '../../../services/private-onboarding-kyc-task/start-phone-verification';
import getPhoneCountryCodes from '../../../services/private-onboarding-kyc-task/get-phone-country-codes';
import getAllowedResidencies from '../../../services/task/get-allowed-residences';
import isMissingTaskError from '../../../services/task/is-missing-task-error';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import {TaskFormProps} from '../../task-form';
import BankAccountStepForm from '../../task-form/bank-account-step-form/index';
import {itemLabel, itemValue} from '../../task-form/info-overview.css';
import MultiStepTaskForm, {MultiStepTaskFormState} from '../../task-form/multi-step-task-form';
import AccountVerificationInformationStep from './account-verification-information-step';
import AddressStepForm from '../../task-form/address-step-form';
import PhoneInformationStepForm from '../../task-form/phone-information-step-form';
import DualNationalityInformationStep from './dual-nationality-information-step';
import DualNationalitySelectStep from './dual-nationality-select-step';
import ErrorsInformationStep from './errors-information-step';
import GeoLocationStep from './geo-location-step';
import IdUploadConfirmationStep from './id-upload-confirmation-step';
import IdUploadStep from './id-upload-step';
import IdUploadEditingStep from './id-upload-editing-step';
import IdUploadInstructionStep from './id-upload-instruction-step';
import PhoneVerificationConfirmationStep from '../phone-verification-task-form/confirmation-step';
import PersonalInformationStep from './personal-information-step';
import PlaceOfBirthInformationStep from './place-of-birth-information-step';
import {inconsistentDataErrorsList} from './private-onboarding-kyc-task-form.css';
import ProfessionInformationStep from './profession-information-step';
import SelfieStep from './selfie-step';
import UsPersonInformationStepForm from '../../task-form/us-person-information-step-form';
import WelcomeStep from './welcome-step';

/**
 * ----------------------------
 * The display order of steps |
 * BE step -> FE steps        |
 * ---------------------------
 * ==== Desktop and Mobile =====
 * PERSONAL_INFORMATION
 *  - WELCOME
 * PHONE_VERIFICATION
 *  - PHONE_VERIFICATION_CONFIRMATION
 * ADDRESS
 * ==== Only Mobile ====
 * ID_UPLOAD
 *  - ID_UPLOAD
 *  - ID_UPLOAD_INSTRUCTION
 *  - ID_UPLOAD_CONFIRMATION || ID_UPLOAD_EDITING
 * BIRTH_DATA
 * SELFIE
 * METADATA
 * DUAL_NATIONALITY
 *  - DUAL_NATIONALITY_SELECT
 *  - DUAL_NATIONALITY_INFORMATION
 * US_PERSON
 * PROFESSIONAL_INFORMATION
 * BANK_ACCOUNT
 * ACCOUNT_VERIFICATION
 * ----------------
 * Additional step |
 * ----------------
 * ERRORS_INFORMATION
 **/
const allStepsFlow: PrivateOnboardingKycTaskSteps[] = [
    PrivateOnboardingKycTaskSteps.WELCOME,
    PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION,
    PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION_CONFIRMATION,
    PrivateOnboardingKycTaskSteps.PERSONAL_INFORMATION,
    PrivateOnboardingKycTaskSteps.ADDRESS,
    PrivateOnboardingKycTaskSteps.ID_UPLOAD,
    PrivateOnboardingKycTaskSteps.ID_UPLOAD_COUNTRY,
    PrivateOnboardingKycTaskSteps.ID_UPLOAD_DOCUMENT_TYPE,
    PrivateOnboardingKycTaskSteps.ID_UPLOAD_INSTRUCTION,
    PrivateOnboardingKycTaskSteps.ID_UPLOAD_CONFIRMATION,
    PrivateOnboardingKycTaskSteps.BIRTH_DATA,
    PrivateOnboardingKycTaskSteps.SELFIE,
    PrivateOnboardingKycTaskSteps.METADATA,
    PrivateOnboardingKycTaskSteps.DUAL_NATIONALITY_SELECT,
    PrivateOnboardingKycTaskSteps.DUAL_NATIONALITY_INFORMATION,
    PrivateOnboardingKycTaskSteps.US_PERSON,
    PrivateOnboardingKycTaskSteps.PROFESSIONAL_INFORMATION,
    PrivateOnboardingKycTaskSteps.BANK_ACCOUNT,
    PrivateOnboardingKycTaskSteps.ACCOUNT_VERIFICATION
];
const allPlatformsSteps: PrivateOnboardingKycTaskSteps[] = [
    PrivateOnboardingKycTaskSteps.WELCOME,
    PrivateOnboardingKycTaskSteps.ADDRESS,
    PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION_CONFIRMATION,
    PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION,
    PrivateOnboardingKycTaskSteps.PERSONAL_INFORMATION
];
const defaultTaskStatusInformation: TaskStatusInformation = {
    status: TaskStatus.OPEN,
    step: PrivateOnboardingKycTaskSteps.PERSONAL_INFORMATION,
    globalErrors: undefined,
    inconsistentDataErrors: undefined
};

export interface State extends MultiStepTaskFormState {
    step: PrivateOnboardingKycTaskSteps;
    initialStep: PrivateOnboardingKycTaskSteps;
    stepsHistory: PrivateOnboardingKycTaskSteps[];
    phoneInformationData?: PhoneInformationStepData;
    phoneVerificationStartResult?: PhoneVerificationStartResult;
    addressInformation: Partial<AddressInfo>;
    documentScannerResult: Partial<DocumentScannerResult>;
    countryInformation?: CountryInformation;
    bankAccount?: PrivateOnboardingBankAccountInfo;
    taskStatusInformation: TaskStatusInformation;
    isOutdatedAppVersion: boolean;
    mifidIdNumberData?: MifidIdNumberData;
    allowedResidencies: Country[];
    documentType?: ScannerDocumentTypes;
    canShowErrorsInformationStep: boolean;
    usPersonStepData?: UsPersonInformation;
    phoneCountryCodes?: PhoneCountryCodes;
    stateError?: Error | AppError;
}

export default class PrivateOnboardingKycTaskForm extends MultiStepTaskForm<TaskFormProps, State> {
    private unsubscribeFromTaskStatusPolling?: () => void;
    constructor(props: TaskFormProps) {
        super(props);
        this.state = {
            step: PrivateOnboardingKycTaskSteps.WELCOME,
            initialStep: PrivateOnboardingKycTaskSteps.WELCOME,
            formData: {},
            addressInformation: {
                streetAddress: undefined,
                streetAddressNumber: undefined,
                streetAddressExt: undefined,
                zip: undefined,
                city: undefined,
                country: undefined
            },
            documentScannerResult: {},
            isLoading: true,
            hasInitialData: false,
            taskStatusInformation: defaultTaskStatusInformation,
            stepsHistory: [],
            isOutdatedAppVersion: false,
            documentType: undefined,
            allowedResidencies: [],
            canShowErrorsInformationStep: true,
            usPersonStepData: undefined,
            phoneCountryCodes: undefined,
            stateError: undefined
        };
    }

    private onWelcomeStepFormSubmit = () => {
        this.goToNextStep(PrivateOnboardingKycTaskSteps.PERSONAL_INFORMATION, {trackStep: true});
    };

    private onIdUploadStepFormSubmit = (
        {documentType}: DocumentTypeInformation,
        countryInformation: CountryInformation
    ) => {
        this.setState({
            documentType,
            countryInformation
        });
        this.goToNextStep(PrivateOnboardingKycTaskSteps.ID_UPLOAD_INSTRUCTION, {trackStep: true});
    };

    private onIdUploadInstructionStepFormSubmit = (documentScannerResult: DocumentScannerResult) => {
        let nextStep: PrivateOnboardingKycTaskSteps = PrivateOnboardingKycTaskSteps.ID_UPLOAD_CONFIRMATION;

        // [CLM-291] when document scanner result don't have a mrzInfo we should show ID_UPLOAD_EDITING
        if (!documentScannerResult.mrzInfo) {
            nextStep = PrivateOnboardingKycTaskSteps.ID_UPLOAD_EDITING;
        }

        if (
            documentScannerResult.mrzInfo &&
            this.state.countryInformation?.country !== documentScannerResult.mrzInfo.nationality
        ) {
            this.showDocumentIssuingCountryWarning();
        }

        this.setState({documentScannerResult});
        this.goToNextStep(nextStep, {trackStep: true});
    };

    private showDocumentIssuingCountryWarning = () => {
        const {
            i18n,
            task: {taskType}
        } = this.props;
        const nextStep =
            this.state.step === PrivateOnboardingKycTaskSteps.ID_UPLOAD_EDITING
                ? PrivateOnboardingKycTaskSteps.ID_UPLOAD_EDITING
                : PrivateOnboardingKycTaskSteps.ID_UPLOAD;

        // [CLM-2783] when the document issuing Country not the same as the selected country of issuing the document
        // we should show message and redirect to ID_UPLOAD step again
        this.props.openModal({
            content: (
                <InnerHtml>{localize(i18n, `task.${taskType}.documentIssuingCountryWarning.description`)}</InnerHtml>
            ),
            actions: [
                {
                    component: 'button',
                    props: {
                        type: 'button',
                        onClick: () => this.goToNextStep(nextStep, {trackStep: true})
                    },
                    content: localize(i18n, 'modals.continueTitle')
                }
            ]
        });
    };

    private onConfirmDocumentInformationStepFormSubmit = () => {
        const {
            i18n,
            task: {taskType}
        } = this.props;
        const {documentScannerResult} = this.state;
        const {mrzInfo} = documentScannerResult;

        // [CLM-1646] we need to have an extra validation by the client that everything is correct
        // We should alert them here to pay special attention to the name and doc number
        this.props.openModal({
            title: localize(i18n, `task.${taskType}.idUploadConfirmationWarning.title`),
            content: (
                <>
                    <InnerHtml>{localize(i18n, `task.${taskType}.idUploadConfirmationWarning.description`)}</InnerHtml>
                    <div className={gridStyles.row}>
                        <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                            {localize(i18n, 'taskManager.task.taskForm.firstName')}
                        </Cell>
                        <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                            {mrzInfo?.firstName}
                        </Cell>
                        <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                            {localize(i18n, 'taskManager.task.taskForm.lastName')}
                        </Cell>
                        <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                            {mrzInfo?.lastName}
                        </Cell>
                        <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                            {localize(i18n, 'taskManager.task.taskForm.documentNumber')}
                        </Cell>
                        <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                            {mrzInfo?.documentNumber}
                        </Cell>
                    </div>
                </>
            ),
            actions: [
                {
                    component: 'button',
                    props: {
                        type: 'button',
                        onClick: () => this.onEditDocumentInformation()
                    },
                    content: localize(i18n, 'taskManager.task.editAction')
                },
                {
                    component: 'button',
                    props: {
                        type: 'button',
                        onClick: () =>
                            this.onCompleteDocumentInformationStep(documentScannerResult as DocumentScannerResult)
                    },
                    content: localize(i18n, 'modals.continueTitle')
                }
            ]
        });
    };

    private onCompleteDocumentInformationStep(documentScannerResult: DocumentScannerResult) {
        this.setState({isLoading: true});

        uploadIdDocument(this.props.config, this.props.task, documentScannerResult)
            .then(this.onTaskStatusInformation)
            .catch((error: Error | AppError) => {
                logErrorLocally(error);
                this.props.openErrorModal(error);
                this.setState({isLoading: false});
            });
    }

    private onSubmitAddressInformationStep = (addressInformation: Partial<AddressInfo>) => {
        this.setState({isLoading: true});

        saveAddressInformation(this.props.config, this.props.task, addressInformation)
            .then(this.checkTaskStatusInformation)
            .catch((error: Error | AppError) => {
                this.setState({isLoading: false, stateError: error});
            });
    };

    private onEditDocumentInformation = () => {
        this.goToNextStep(PrivateOnboardingKycTaskSteps.ID_UPLOAD_EDITING, {trackStep: true});
    };

    private onPhoneVerificationStartStepFormSubmit = (phoneInformationData: PhoneInformationStepData) => {
        this.setState({isLoading: true});

        startPhoneVerification(this.props.config, this.props.task, phoneInformationData)
            .then((phoneVerificationStartResult: PhoneVerificationStartResult) => {
                this.setState({phoneInformationData, phoneVerificationStartResult});
                this.goToNextStep(PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION_CONFIRMATION, {trackStep: true});
            })
            .catch((error: Error | AppError) => {
                logErrorLocally(error);
                this.props.openErrorModal(error);
            })
            .finally(() => this.setState({isLoading: false}));
    };

    private onPhoneVerificationConfirmationFormSubmit = (
        phoneVerificationConfirmationData: PhoneVerificationConfirmationData
    ) => {
        const {task} = this.props;

        this.setState({isLoading: true});
        confirmPhoneVerification(this.props.config, task, phoneVerificationConfirmationData)
            .then(() => {
                trackAnalytics(TrackerEventTypes.PHONE_NUMBER_PROVIDED, {taskType: task.taskType});
                this.checkTaskStatusInformation();
            })
            .catch((error: Error | AppError) => {
                logErrorLocally(error);
                this.props.openErrorModal(error);
            })
            .finally(() => this.setState({isLoading: false}));
    };

    private goToPlaceOfBirthInformationStep = () => {
        this.goToNextStep(PrivateOnboardingKycTaskSteps.BIRTH_DATA, {trackStep: true});
    };

    private onSkipNfc = () => {
        skipNfc(this.props.config, this.props.task)
            .then(this.onTaskStatusInformation)
            .catch((error: Error) => {
                logErrorLocally(error);
                this.setState({isLoading: false});
                this.props.openErrorModal(error);
            });
    };

    private onErrorsInformationStepSubmit = () => {
        this.goToNextStep(this.state.taskStatusInformation.step, {trackStep: true});
    };

    private onDualNationalitySelectStepFormSubmit = ({mifidIdNumberData, status}: DualNationalityUpdateResult) => {
        if (mifidIdNumberData?.isMifidIdNumberRequired) {
            this.setState({mifidIdNumberData});
            this.goToNextStep(PrivateOnboardingKycTaskSteps.DUAL_NATIONALITY_INFORMATION, {trackStep: true});
        } else {
            this.onTaskStatusInformation(status);
        }
    };

    private saveBankAccountStepData = (bankAccount: Partial<BankAccountInfo>) => {
        this.setState({isLoading: true});

        saveBankAccountStepData(this.props.config, this.props.task, bankAccount)
            .then(this.onTaskStatusInformation)
            .catch((error: Error | AppError) => {
                this.setState({isLoading: false, stateError: error});
            });
    };

    private saveUsPersonStepData = (usPersonStepData: UsPersonStepData): Promise<void> => {
        return saveUsPersonStepData(this.props.config, this.props.task, usPersonStepData).then(
            this.onTaskStatusInformation
        );
    };

    private onPhoneEdit = () => {
        this.goToNextStep(PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION, {trackStep: true});
    };

    // [CLM-663] We should show popup with the errors on the first screen of each step (which had errors)
    private checkStepErrors = (step: PrivateOnboardingKycTaskSteps) => {
        const {
            i18n,
            task: {taskType}
        } = this.props;
        const stepErrors: string[] | undefined = this.state.taskStatusInformation.inconsistentDataErrors?.[step];
        const i18nTaskKey = `task.${taskType}.inconsistentDataError`;

        if (stepErrors?.length) {
            this.props.openModal({
                title: localize(i18n, `${i18nTaskKey}.title`),
                content: (
                    <>
                        <InnerHtml>{localize(i18n, `${i18nTaskKey}.description`)}</InnerHtml>
                        <ul className={inconsistentDataErrorsList}>
                            {stepErrors.map((i18nKey: string) => (
                                <li key={i18nKey}>{localize(i18n, i18nKey)}</li>
                            ))}
                        </ul>
                    </>
                ),
                actions: [
                    {
                        component: 'button',
                        content: localize(i18n, 'modals.continueTitle')
                    }
                ]
            });
        }
    };

    private renderNonAppWarning() {
        const {
            i18n,
            task: {taskType}
        } = this.props;

        return (
            <>
                <div className={gridStyles.row}>
                    <Cell size={12}>{localize(i18n, `task.${taskType}.nonAppWarning.title`)}</Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <InnerHtml>{localize(i18n, `task.${taskType}.nonAppWarning.description`)}</InnerHtml>
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <AppLinks i18n={i18n} />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <InnerHtml>{localize(i18n, `task.${taskType}.nonAppWarning.requirements`)}</InnerHtml>
                    </Cell>
                </div>
            </>
        );
    }

    private renderOutdatedAppVersionWarning() {
        return (
            <div className={gridStyles.row}>
                <Cell size={12}>
                    <InnerHtml>
                        {localize(this.props.i18n, `task.${this.props.task.taskType}.outdatedAppVersionWarning`)}
                    </InnerHtml>
                </Cell>
            </div>
        );
    }

    private checkTaskStatusInformation = () => {
        this.setState({isLoading: true});
        getTaskStatusInformation(this.props.config, this.props.task)
            .then(this.onTaskStatusInformation)
            .catch((error: Error | AppError) => {
                // [CLM-1552] We should retry getting status information in case of request timeout error
                if (isRequestTimeoutError(error)) {
                    this.checkTaskStatusInformation();
                    return;
                }
                this.props.openErrorModal(error);
                logErrorLocally(error);
                this.setState({isLoading: false});
            });
    };

    private onFinishTask = (nextTaskId?: number) => {
        this.props
            .onFinishTask(this.props.task)
            .then(() => {
                return nextTaskId ? this.redirectToTask(nextTaskId) : this.redirectToTasks();
            })
            .catch(logErrorLocally);
    };

    private logout() {
        const {config} = this.props;

        logout(config)
            // redirect to the login page even if we got the error
            .catch(logErrorLocally)
            .then(() => redirectToLoginPage(config))
            .catch(logErrorLocally);
    }

    private waitTaskSettledStatus() {
        this.unsubscribeFromTaskStatusPolling = waitTaskSettledStatus(
            this.props.config,
            this.props.task,
            (error: null | Error | AppError, taskStatusInformation?: TaskStatusInformation) => {
                if (error) {
                    if (isMissingTaskError(error)) {
                        this.onFinishTask();
                    }
                    logErrorLocally(error);
                } else if (taskStatusInformation) {
                    this.onTaskStatusInformation(taskStatusInformation);
                }
            }
        );
    }

    private getViewStep = (step: PrivateOnboardingKycTaskSteps): PrivateOnboardingKycTaskSteps => {
        let nextStep: PrivateOnboardingKycTaskSteps = step;

        if (step === PrivateOnboardingKycTaskSteps.PERSONAL_INFORMATION) {
            nextStep = PrivateOnboardingKycTaskSteps.WELCOME;
        } else if (step === PrivateOnboardingKycTaskSteps.DUAL_NATIONALITY) {
            nextStep = PrivateOnboardingKycTaskSteps.DUAL_NATIONALITY_SELECT;
        } else if (step === PrivateOnboardingKycTaskSteps.NFC_SCAN) {
            // [CLM-3354] for clients who has open onboarding task and they have reached the NFC step
            // we should show the place of birth step and for further skipping the NFC step
            nextStep = PrivateOnboardingKycTaskSteps.BIRTH_DATA;
        }

        return nextStep;
    };

    private onTaskStatusInformation = (taskStatusInformation: TaskStatusInformation) => {
        const {
            i18n,
            task: {taskType}
        } = this.props;
        const {status, nextTaskId, step} = taskStatusInformation;
        const viewStep: PrivateOnboardingKycTaskSteps = this.getViewStep(step);

        if (nextTaskId && (status === TaskStatus.PEP || status === TaskStatus.SUCCESS)) {
            // if PEP or SUCCESS status and account verification step and nextTaskId
            // -> load tasks list and redirect to the next task
            return this.onFinishTask(nextTaskId);
        }

        if (status === TaskStatus.REJECTED || status === TaskStatus.FRAUD) {
            // [CLM-1520] IF client is REJECTED or is FRAUD we should show pop-up with relevant text (in description)
            // and "confirm" button. When clicked it logs the client out
            this.props.openModal({
                content: localize(i18n, `task.${taskType}.accountOpeningError.${status}.description`),
                actions: [
                    {
                        component: 'button',
                        props: {
                            type: 'button',
                            onClick: () => this.logout()
                        },
                        content: localize(i18n, 'modals.confirmTitle')
                    }
                ]
            });
            return;
        }

        if (
            viewStep === PrivateOnboardingKycTaskSteps.ACCOUNT_VERIFICATION &&
            (status === TaskStatus.READY_TO_SEND ||
                status === TaskStatus.PENDING ||
                status === TaskStatus.PEP ||
                status === TaskStatus.SUCCESS)
        ) {
            this.setState({taskStatusInformation, isLoading: false});
            this.goToNextStep(PrivateOnboardingKycTaskSteps.ACCOUNT_VERIFICATION, {trackStep: true});
            this.waitTaskSettledStatus();
            return;
        }

        if (status === TaskStatus.INCONSISTENT_DATA && this.state.canShowErrorsInformationStep) {
            this.setState({
                canShowErrorsInformationStep: false,
                taskStatusInformation,
                isLoading: false
            });
            this.goToNextStep(PrivateOnboardingKycTaskSteps.ERRORS_INFORMATION, {trackStep: true});
            return;
        }

        if (
            status === TaskStatus.OPEN ||
            status === TaskStatus.READY_TO_SEND ||
            status === TaskStatus.PENDING ||
            status === TaskStatus.PEP ||
            status === TaskStatus.ERROR ||
            status === TaskStatus.SUCCESS ||
            status === TaskStatus.INCONSISTENT_DATA
        ) {
            this.setState({
                stepsHistory:
                    viewStep === PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION
                        ? []
                        : allStepsFlow.slice(0, allStepsFlow.indexOf(viewStep)),
                taskStatusInformation,
                isLoading: false
            });
            this.goToNextStep(viewStep, {trackStep: true});
        }
    };

    private checkAndRedirectToPrevStep = () => {
        this.setState({isLoading: true});
        getTaskPrevStep(this.props.config, this.props.task)
            .then(this.checkTaskStatusInformation)
            .catch((error: Error) => {
                logErrorLocally(error);
                this.props.openErrorModal(error);
                this.setState({isLoading: false});
            });
    };

    private getInitialData() {
        const {config, task} = this.props;

        this.setState({isLoading: true, hasInitialData: false});

        getTaskStatusInformation(config, task)
            .then((taskStatusInformation: TaskStatusInformation) => {
                this.onTaskStatusInformation(taskStatusInformation);
                return Promise.all<
                    Country[],
                    AddressInfo,
                    PrivateOnboardingBankAccountInfo,
                    IdUploadDocumentScannerResult,
                    UsPersonInformation,
                    PhoneCountryCodes
                >([
                    getAllowedResidencies(config, this.props.mainClient, this.props.i18n),
                    getAddressInformation(config, task),
                    getBankAccountStepData(config, task),
                    getIdDocumentScannerResult(config, task),
                    getUsPersonStepData(config, task),
                    getPhoneCountryCodes(config)
                ]);
            })
            .then(
                ([
                    allowedResidencies,
                    addressInformation,
                    bankAccount,
                    documentScannerResult,
                    usPersonStepData,
                    phoneCountryCodes
                ]) => {
                    this.setState({
                        allowedResidencies,
                        addressInformation,
                        bankAccount,
                        documentScannerResult,
                        usPersonStepData,
                        phoneCountryCodes,
                        isLoading: false,
                        hasInitialData: true
                    });
                }
            )
            .catch((error: Error | AppError) => {
                // [CLM-1552] We should retry getting initial data in case of request timeout error
                if (isRequestTimeoutError(error)) {
                    this.getInitialData();
                    return;
                }
                if (isMissingTaskError(error)) {
                    return this.onFinishTask();
                }
                logErrorLocally(error);
                this.props.openErrorModal(error);
                this.setState({isLoading: false});
            });
    }

    private checkIfAppIsUpdated() {
        if (!isWebViewApp()) {
            return;
        }

        Promise.all([isFourthlineScannerSupported(), isCameraPluginSupported(), isGeolocationPluginSupported()])
            .then((statuses: boolean[]) => {
                this.setState({
                    isOutdatedAppVersion: statuses.some((isSupported: boolean) => !isSupported)
                });
            })
            .catch(logErrorLocally);
    }

    componentDidMount(): void {
        this.trackStepView();
        this.checkIfAppIsUpdated();
        this.getInitialData();
    }

    componentWillUnmount() {
        this.unsubscribeFromTaskStatusPolling?.();
        this.unsubscribeFromTaskStatusPolling = undefined;
    }

    componentDidUpdate(prevProps: Readonly<TaskFormProps>, prevState: Readonly<State>): void {
        super.componentDidUpdate(prevProps, prevState);
        if (this.state.step !== prevState.step) {
            this.checkStepErrors(this.state.step);
        }
    }

    render() {
        const {task} = this.props;
        const {
            step,
            isLoading,
            phoneInformationData,
            phoneVerificationStartResult,
            documentScannerResult,
            countryInformation,
            bankAccount,
            documentType,
            mifidIdNumberData,
            phoneCountryCodes,
            stateError
        } = this.state;

        if (isLoading) {
            return <Spinner local={true} />;
        }

        if (!allPlatformsSteps.includes(step) && !isWebViewApp()) {
            return this.renderNonAppWarning();
        }

        if (this.state.isOutdatedAppVersion) {
            return this.renderOutdatedAppVersionWarning();
        }

        const geolocation: GeolocationCoordinates | undefined =
            documentScannerResult.documentScans?.[0]?.metadata?.location;

        switch (step) {
            case PrivateOnboardingKycTaskSteps.PERSONAL_INFORMATION:
                return (
                    <PersonalInformationStep
                        task={task}
                        onBack={this.goToPrevStep}
                        onSubmit={this.onTaskStatusInformation}
                    />
                );
            case PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION:
                if (phoneCountryCodes) {
                    return (
                        <PhoneInformationStepForm
                            task={task}
                            phoneCountryCodes={phoneCountryCodes}
                            onBack={this.checkAndRedirectToPrevStep}
                            onSubmit={this.onPhoneVerificationStartStepFormSubmit}
                        />
                    );
                }
                return null;
            case PrivateOnboardingKycTaskSteps.PHONE_VERIFICATION_CONFIRMATION:
                if (phoneInformationData && phoneVerificationStartResult) {
                    return (
                        <PhoneVerificationConfirmationStep
                            task={task}
                            onBack={this.onPhoneEdit}
                            startStepData={phoneInformationData}
                            startStepResult={phoneVerificationStartResult}
                            onPhoneEdit={this.onPhoneEdit}
                            onSubmit={this.onPhoneVerificationConfirmationFormSubmit}
                        />
                    );
                }
                return null;
            case PrivateOnboardingKycTaskSteps.ADDRESS:
                return (
                    <AddressStepForm
                        task={task}
                        countries={this.state.allowedResidencies}
                        taskTitle={localize(this.props.i18n, `task.${task.taskType}.ADDRESS.title`)}
                        taskDescriptionTranslationCode={`task.${task.taskType}.ADDRESS.description`}
                        hasSkipTaskLink={false}
                        error={stateError}
                        onBack={this.checkAndRedirectToPrevStep}
                        addressInfo={this.state.addressInformation}
                        onSubmit={this.onSubmitAddressInformationStep}
                    />
                );
            case PrivateOnboardingKycTaskSteps.ID_UPLOAD:
                return <IdUploadStep task={task} onBack={this.goToPrevStep} onSubmit={this.onIdUploadStepFormSubmit} />;
            case PrivateOnboardingKycTaskSteps.ID_UPLOAD_INSTRUCTION:
                if (documentType) {
                    return (
                        <IdUploadInstructionStep
                            task={task}
                            documentType={documentType}
                            onBack={this.goToPrevStep}
                            onSubmit={this.onIdUploadInstructionStepFormSubmit}
                        />
                    );
                }
                return null;
            case PrivateOnboardingKycTaskSteps.ID_UPLOAD_CONFIRMATION:
                if (documentScannerResult.mrzInfo) {
                    return (
                        <IdUploadConfirmationStep
                            task={task}
                            mrzInfo={documentScannerResult.mrzInfo}
                            onBack={this.onEditDocumentInformation}
                            onSubmit={this.onConfirmDocumentInformationStepFormSubmit}
                        />
                    );
                }
                return null;
            case PrivateOnboardingKycTaskSteps.ID_UPLOAD_EDITING:
                return (
                    <IdUploadEditingStep
                        task={task}
                        documentIssuingCountry={countryInformation?.country}
                        documentScannerResult={documentScannerResult}
                        onSubmit={this.onTaskStatusInformation}
                        onError={this.showDocumentIssuingCountryWarning}
                    />
                );
            case PrivateOnboardingKycTaskSteps.BIRTH_DATA:
                return (
                    <PlaceOfBirthInformationStep
                        task={task}
                        onBack={this.checkAndRedirectToPrevStep}
                        // [CLM-3354] For new clients, we will automatically skip the NFC step
                        onSubmit={this.onSkipNfc}
                    />
                );
            case PrivateOnboardingKycTaskSteps.SELFIE:
                return (
                    <SelfieStep
                        task={task}
                        onBack={this.goToPlaceOfBirthInformationStep}
                        onSubmit={this.onTaskStatusInformation}
                    />
                );
            case PrivateOnboardingKycTaskSteps.METADATA:
                return (
                    <GeoLocationStep
                        task={task}
                        geolocation={geolocation}
                        onBack={this.goToPrevStep}
                        onSubmit={this.onTaskStatusInformation}
                    />
                );
            case PrivateOnboardingKycTaskSteps.DUAL_NATIONALITY_SELECT:
                return <DualNationalitySelectStep task={task} onSubmit={this.onDualNationalitySelectStepFormSubmit} />;
            case PrivateOnboardingKycTaskSteps.DUAL_NATIONALITY_INFORMATION:
                if (mifidIdNumberData) {
                    return (
                        <DualNationalityInformationStep
                            task={task}
                            onBack={this.goToPrevStep}
                            mifidIdNumberData={mifidIdNumberData}
                            onSubmit={this.onTaskStatusInformation}
                        />
                    );
                }
                return null;
            case PrivateOnboardingKycTaskSteps.US_PERSON:
                return (
                    <UsPersonInformationStepForm
                        task={task}
                        onBack={this.checkAndRedirectToPrevStep}
                        usPersonInformation={this.state.usPersonStepData}
                        onSubmit={this.saveUsPersonStepData}
                    />
                );
            case PrivateOnboardingKycTaskSteps.PROFESSIONAL_INFORMATION:
                return (
                    <ProfessionInformationStep
                        task={task}
                        onBack={this.checkAndRedirectToPrevStep}
                        onSubmit={this.onTaskStatusInformation}
                    />
                );
            case PrivateOnboardingKycTaskSteps.BANK_ACCOUNT:
                if (bankAccount) {
                    return (
                        <BankAccountStepForm
                            task={task}
                            error={stateError}
                            bankAccount={bankAccount}
                            onSubmit={this.saveBankAccountStepData}
                            onBack={this.checkAndRedirectToPrevStep}
                        />
                    );
                }
                return null;
            case PrivateOnboardingKycTaskSteps.ACCOUNT_VERIFICATION:
                return <AccountVerificationInformationStep task={task} />;
            case PrivateOnboardingKycTaskSteps.ERRORS_INFORMATION:
                return (
                    <ErrorsInformationStep
                        task={task}
                        taskStatusInformation={this.state.taskStatusInformation}
                        onSubmit={this.onErrorsInformationStepSubmit}
                    />
                );
            default:
                return <WelcomeStep task={task} onSubmit={this.onWelcomeStepFormSubmit} />;
        }
    }
}
