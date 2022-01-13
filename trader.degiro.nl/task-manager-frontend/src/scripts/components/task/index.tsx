import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import * as buttonStyles from 'frontend-core/dist/components/ui-trader3/button/button.css';
import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import {logWarningLocally} from 'frontend-core/dist/loggers/local-logger';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {Task as TaskModel} from 'frontend-core/dist/models/task/task';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import hasTranslation from 'frontend-core/dist/services/i18n/has-translation';
import localize from 'frontend-core/dist/services/i18n/localize';
import isActiveTraderAppropriatenessTestTask from 'frontend-core/dist/services/task/appropriateness-test/is-active-trader-appropriateness-test-task';
import isCertificateAppropriatenessTestTask from 'frontend-core/dist/services/task/appropriateness-test/is-certificate-appropriateness-test-task';
import isOnboardingAppropriatenessTestTask from 'frontend-core/dist/services/task/appropriateness-test/is-onboarding-appropriateness-test-task';
import isFlatexForeignAccountOpeningTask from 'frontend-core/dist/services/task/flatex-foreign-account-opening/is-flatex-foreign-account-opening-task';
import getTaskTitle from 'frontend-core/dist/services/task/get-task-title';
import isBankAccountVerificationTask from 'frontend-core/dist/services/task/is-bank-account-verification-task';
import isBetaTestParticipationTask from 'frontend-core/dist/services/task/is-beta-test-participation-task';
import isCashFundChoiceCzTask from 'frontend-core/dist/services/task/is-cash-fund-choice-cz-task';
import isCashFundChoicePlTask from 'frontend-core/dist/services/task/is-cash-fund-choice-pl-task';
import isCashFundChoiceTask from 'frontend-core/dist/services/task/is-cash-fund-choice-task';
import isCompanyBusinessActivitiesTask from 'frontend-core/dist/services/task/is-company-business-activities-task';
import isCompanyComplianceQuestionnaireTask from 'frontend-core/dist/services/task/is-company-compliance-questionnaire-task';
import isCompanyIncorporationDocumentsTask from 'frontend-core/dist/services/task/is-company-incorporation-documents-task';
import isCompanyInformationTask from 'frontend-core/dist/services/task/is-company-information-task';
import isCompanyLegalRepresentativesTask from 'frontend-core/dist/services/task/is-company-legal-representatives-task';
import isCompanyQuestionnaireTask from 'frontend-core/dist/services/task/is-company-questionnaire-task';
import isCompanyStructureDocumentsTask from 'frontend-core/dist/services/task/is-company-structure-documents-task';
import isCompanyUbosTask from 'frontend-core/dist/services/task/is-company-ubos-task';
import isFatcaPartnerTask from 'frontend-core/dist/services/task/is-fatca-partner-task';
import isFlatexAccountOpeningTask from 'frontend-core/dist/services/task/is-flatex-account-opening-task';
import isFlatexMigrationTask from 'frontend-core/dist/services/task/is-flatex-migration-task';
import isFrenchDomesticTaxRegimeTask from 'frontend-core/dist/services/task/is-french-domestic-tax-regime-task';
import isKnowledgeQuestionnaireTask from 'frontend-core/dist/services/task/is-knowledge-questionnaire-task';
import isLeiTask from 'frontend-core/dist/services/task/is-lei-task';
import isPepDeclarationTask from 'frontend-core/dist/services/task/is-pep-declaration-task';
import isPepQuestionTask from 'frontend-core/dist/services/task/is-pep-question-task';
import isPhoneVerificationTask from 'frontend-core/dist/services/task/is-phone-verification-task';
import isPrivateMissingAgreementsTask from 'frontend-core/dist/services/task/is-private-missing-agreements-task';
import isPrivateOnboardingAgreementsTask from 'frontend-core/dist/services/task/is-private-onboarding-agreements-task';
import isPrivateOnboardingInformationTask from 'frontend-core/dist/services/task/is-private-onboarding-information-task';
import isPrivateOnboardingKycTask from 'frontend-core/dist/services/task/is-private-onboarding-kyc-task';
import isPrivateUpgradeAgreementsTask from 'frontend-core/dist/services/task/is-private-upgrade-agreements-task';
import isProofOfResidenceTask from 'frontend-core/dist/services/task/is-proof-of-residence-task';
import isSourcesOfWealthDeclarationTask from 'frontend-core/dist/services/task/is-sources-of-wealth-declaration-task';
import isSourcesOfWealthProofTask from 'frontend-core/dist/services/task/is-sources-of-wealth-proof-task';
import isUploadIdMifidPartnerTask from 'frontend-core/dist/services/task/is-upload-id-mifid-partner-task';
import isUploadIdMifidTask from 'frontend-core/dist/services/task/is-upload-id-mifid-task';
import isUploadIdPartnerTask from 'frontend-core/dist/services/task/is-upload-id-partner-task';
import isUploadIdTask from 'frontend-core/dist/services/task/is-upload-id-task';
import isCompanyTinsTask from 'frontend-core/dist/services/task/tins/is-company-tins-task';
import isPersonTinsTask from 'frontend-core/dist/services/task/tins/is-person-tins-task';
import isCompanyUsTreatyEntitlementQuestionnaireTask from 'frontend-core/dist/services/task/us-treaty-entitlement/is-company-us-treaty-entitlement-questionnaire-task';
import isCompanyUsTreatyEntitlementTask from 'frontend-core/dist/services/task/us-treaty-entitlement/is-company-us-treaty-entitlement-task';
import isPersonUsTreatyEntitlementTask from 'frontend-core/dist/services/task/us-treaty-entitlement/is-person-us-treaty-entitlement-task';
import isUsTreatyEntitlementAffidavitTask from 'frontend-core/dist/services/task/us-treaty-entitlement/is-us-treaty-entitlement-affidavit-task';
import * as React from 'react';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import getTaskFormVirtualPageLocation from '../../services/analytics/get-task-form-virtual-page-location';
import shouldSendGenericTaskCompleteEvent from '../../services/analytics/should-send-generic-task-complete-event';
import getOpenedTask from '../../services/task/get-opened-task';
import {
    AppApiContext,
    AppParamsContext,
    ConfigContext,
    CountriesContext,
    CurrentClientContext,
    I18nContext,
    MainClientContext,
    NationalitiesContext,
    TasksInfoContext
} from '../app-component/app-context';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import ProceedAfterTaskLink from '../proceed-after-task-link';
import {TaskFormCloseHandler, TaskFormProps} from '../task-form';
import TasksLink from './../tasks-link/index';
import TaskDueDate from './due-date';
import * as taskStyles from './task.css';

const AppropriatenessTestTaskForm = createLazyComponent(
    () =>
        import(/* webpackChunkName: "appropriateness-test-task-form" */ '../task-forms/appropriateness-test-task-form')
);
const BankAccountVerificationTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "bank-account-verification-task-form" */ '../task-forms/bank-account-verification-task-form'
        )
);
const CashFundChoiceCultureTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "cash-fund-choice-culture-task-form" */ '../task-forms/cash-fund-choice-culture-task-form'
        )
);
const CashFundChoiceTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "cash-fund-choice-task-form" */ '../task-forms/cash-fund-choice-task-form')
);
const CompanyBusinessActivitiesTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "company-business-activities-task-form" */ '../task-forms/company-business-activities-task-form'
        )
);
const CompanyIncorporationDocumentsTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "company-incorporation-documents-task-form" */ '../task-forms/company-incorporation-documents-task-form'
        )
);
const CompanyInformationTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "company-information-task-form" */ '../task-forms/company-information-task-form')
);
const CompanyLegalRepresentativesTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "company-legal-representatives-task-form" */ '../task-forms/company-legal-representatives-task-form'
        )
);
const CompanyStructureDocumentsTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "company-structure-documents-task-form" */ '../task-forms/company-structure-documents-task-form'
        )
);
const CompanyTinsTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "company-tins-task-form" */ '../task-forms/company-tins-task-form')
);
const CompanyUbosTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "company-ubos-task-form" */ '../task-forms/company-ubos-task-form')
);
const CompanyUsTreatyEntitlementTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "company-us-treaty-entitlement-task-form" */ '../task-forms/company-us-treaty-entitlement-task-form'
        )
);
const FatcaTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "fatca-task-form" */ '../task-forms/fatca-task-form')
);
const FlatexAccountOpeningTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "flatex-account-opening-task-form" */ '../task-forms/flatex-account-opening-task-form'
        )
);
const FlatexForeignAccountOpeningTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "flatex-foreign-account-opening-task-form" */ '../task-forms/flatex-foreign-account-opening-task-form'
        )
);
const FlatexMigrationTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "flatex-migration-task-form" */ '../task-forms/flatex-migration-task-form')
);
const KnowledgeQuestionnaireTestTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "knowledge-questionnaire-task-form" */ '../task-forms/knowledge-questionnaire-task-form'
        )
);
const LeiTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "lei-task-form" */ '../task-forms/lei-task-form')
);
const NonCompletableTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "non-completable-task-form" */ '../task-forms/non-completable-task-form')
);
const PepQuestionTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "pep-question-task-form" */ '../task-forms/pep-question-task-form')
);
const PersonTinsTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "person-tins-task-form" */ '../task-forms/person-tins-task-form')
);
const PersonUsTreatyEntitlementTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "person-us-treaty-entitlement-task-form" */ '../task-forms/person-us-treaty-entitlement-task-form'
        )
);
const PhoneVerificationTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "phone-verification-task-form" */ '../task-forms/phone-verification-task-form')
);
const PrivateAgreementsTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "private-agreements-task-form" */ '../task-forms/private-agreements-task-form')
);
const PrivateOnboardingAgreementsTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "private-onboarding-agreements-task-form" */ '../task-forms/private-onboarding-agreements-task-form'
        )
);
const PrivateOnboardingInformationTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "private-onboarding-information-task-form" */ '../task-forms/private-onboarding-information-task-form'
        )
);
const PrivateOnboardingKycTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "private-onboarding-kyc-task-form" */ '../task-forms/private-onboarding-kyc-task-form'
        )
);
const ProofOfResidenceTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "proof-of-residence-task-form" */ '../task-forms/proof-of-residence-task-form')
);
const QuestionnaireTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "questionnaire-task-form" */ '../task-forms/questionnaire-task-form')
);
const SourcesOfWealthDeclarationTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "sources-of-wealth-declaration-task-form" */ '../task-forms/sources-of-wealth-declaration-task-form'
        )
);
const SourcesOfWealthProofTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "sources-of-wealth-task-form" */ '../task-forms/sources-of-wealth-task-form')
);
const UploadIdMifidTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "upload-id-mifid-task-form" */ '../task-forms/upload-id-mifid-task-form')
);
const UploadIdTaskForm = createLazyComponent(
    () => import(/* webpackChunkName: "upload-id-task-form" */ '../task-forms/upload-id-task-form')
);
const UsTreatyEntitlementAffidavitTaskForm = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "us-treaty-entitlement-affidavit-task-form" */ '../task-forms/us-treaty-entitlement-affidavit-task-form'
        )
);
const {useState, useEffect, useContext} = React;
const Task: React.FunctionComponent = () => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const currentClient = useContext(CurrentClientContext);
    const countries = useContext(CountriesContext);
    const nationalities = useContext(NationalitiesContext);
    const tasksInfo = useContext(TasksInfoContext);
    const appParams = useContext(AppParamsContext);
    const location = useLocation();
    const history = useHistory();
    const {taskId: taskIdParam} = useParams<{taskId: string}>();
    const [isDone, setIsDone] = useState<boolean>(false);
    const [taskRejectionMessage, setTaskRejectionMessage] = useState<string | undefined>(undefined);
    const [task, setTask] = useState<TaskModel | undefined>(undefined);
    const taskTitleTranslationCode: string | undefined = task && getTaskTitle(task);
    // eslint-disable-next-line max-statements
    const renderTaskForm = (task: TaskModel) => {
        /**
         * @deprecated This property is used only for FATCA tasks, TODO: remove this prop. after removing FATCA tasks
         * @param {TaskFormCloseReason} reason
         * @returns {void}
         */
        const onCloseTaskForm: TaskFormCloseHandler = (reason) => {
            setTaskRejectionMessage(reason && (reason.text || reason.message));
        };
        const onSubmitTaskForm = () => {
            setIsDone(true);

            // do not send an event for the tasks that have their own 'taskComplete' triggers
            if (shouldSendGenericTaskCompleteEvent(task)) {
                trackAnalytics(TrackerEventTypes.TASK_COMPLETE, {taskType: task.taskType});
            }
        };
        const taskFormProps: TaskFormProps = {
            ...app,
            location,
            history,
            i18n,
            config,
            mainClient,
            currentClient,
            tasksInfo,
            countries,
            nationalities,
            appParams,
            task,
            onClose: onCloseTaskForm,
            onSubmit: onSubmitTaskForm
        };
        const {taskId} = task;

        if (!task.isCompletableByClient) {
            return <NonCompletableTaskForm key={`non-completable-task-form-${taskId}`} {...taskFormProps} />;
        }

        if (isFatcaPartnerTask(task)) {
            return <FatcaTaskForm key={`fatca-task-form-${taskId}`} {...taskFormProps} />;
        }

        if (isFlatexAccountOpeningTask(task)) {
            return (
                <FlatexAccountOpeningTaskForm
                    key={`flatex-account-opening-task-form-${taskId}`}
                    {...taskFormProps}
                    task={task}
                />
            );
        }

        if (isFlatexForeignAccountOpeningTask(task)) {
            return (
                <FlatexForeignAccountOpeningTaskForm
                    key={`flatex-foreign-account-opening-task-form-${taskId}`}
                    {...taskFormProps}
                />
            );
        }

        if (isFlatexMigrationTask(task)) {
            return (
                <FlatexMigrationTaskForm
                    key={`flatex-migration-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                />
            );
        }

        if (isUploadIdMifidTask(task) || isUploadIdMifidPartnerTask(task)) {
            return <UploadIdMifidTaskForm key={`upload-id-mifid-task-form-${taskId}`} {...taskFormProps} />;
        }

        if (isUploadIdTask(task) || isUploadIdPartnerTask(task)) {
            return <UploadIdTaskForm key={`upload-id-task-form-${taskId}`} {...taskFormProps} />;
        }

        if (isUsTreatyEntitlementAffidavitTask(task)) {
            return (
                <UsTreatyEntitlementAffidavitTaskForm
                    key={`us-treaty-entitlement-affidavit-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (isLeiTask(task)) {
            return (
                <LeiTaskForm
                    key={`lei-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (isCashFundChoiceTask(task)) {
            return (
                <CashFundChoiceTaskForm
                    key={`cash-fund-choice-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (isPepQuestionTask(task)) {
            return (
                <PepQuestionTaskForm
                    key={`pep-question-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (isCashFundChoicePlTask(task) || isCashFundChoiceCzTask(task)) {
            return (
                <CashFundChoiceCultureTaskForm
                    key={`cash-fund-choice-culture-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (isBankAccountVerificationTask(task)) {
            return (
                <BankAccountVerificationTaskForm
                    key={`bank-account-verification-task-form-${taskId}`}
                    {...taskFormProps}
                />
            );
        }

        if (isCompanyIncorporationDocumentsTask(task)) {
            return (
                <CompanyIncorporationDocumentsTaskForm
                    key={`company-incorporation-documents-task-form-${taskId}`}
                    {...taskFormProps}
                />
            );
        }

        if (isCompanyStructureDocumentsTask(task)) {
            return (
                <CompanyStructureDocumentsTaskForm
                    key={`company-structure-documents-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (
            isActiveTraderAppropriatenessTestTask(task) ||
            isOnboardingAppropriatenessTestTask(task) ||
            isCertificateAppropriatenessTestTask(task)
        ) {
            return (
                <AppropriatenessTestTaskForm
                    key={`appropriateness-test-task-form-${taskId}`}
                    {...taskFormProps}
                    formName={`${task.taskType}_FORM`}
                    hasIntroductionStep={true}
                />
            );
        }

        if (isKnowledgeQuestionnaireTask(task)) {
            return (
                <KnowledgeQuestionnaireTestTaskForm
                    {...taskFormProps}
                    key={`knowledge-questionnaire-task-form-${taskId}`}
                    formName={`${task.taskType}_FORM`}
                    hasIntroductionStep={true}
                />
            );
        }

        if (isCompanyUsTreatyEntitlementTask(task)) {
            return (
                <CompanyUsTreatyEntitlementTaskForm
                    {...taskFormProps}
                    key={`company-us-treaty-entitlement-task-form-${taskId}`}
                />
            );
        }

        if (
            isBetaTestParticipationTask(task) ||
            isCompanyComplianceQuestionnaireTask(task) ||
            isCompanyQuestionnaireTask(task) ||
            isCompanyUsTreatyEntitlementQuestionnaireTask(task) ||
            isFrenchDomesticTaxRegimeTask(task) ||
            isPepDeclarationTask(task)
        ) {
            return (
                <QuestionnaireTaskForm
                    {...taskFormProps}
                    key={`questionnaire-task-form-${taskId}`}
                    formName={`${task.taskType}_FORM`}
                />
            );
        }

        if (isCompanyInformationTask(task)) {
            return <CompanyInformationTaskForm key={`company-information-task-form-${taskId}`} {...taskFormProps} />;
        }

        if (isPersonTinsTask(task)) {
            return (
                <PersonTinsTaskForm
                    key={`person-tins-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (isPrivateMissingAgreementsTask(task) || isPrivateUpgradeAgreementsTask(task)) {
            return (
                <PrivateAgreementsTaskForm key={`private-missing-agreements-task-form-${taskId}`} {...taskFormProps} />
            );
        }

        if (isPrivateOnboardingAgreementsTask(task)) {
            return (
                <PrivateOnboardingAgreementsTaskForm
                    key={`private-onboarding-agreements-task-form-${taskId}`}
                    {...taskFormProps}
                />
            );
        }

        if (isPrivateOnboardingInformationTask(task)) {
            return (
                <PrivateOnboardingInformationTaskForm
                    key={`private-onboarding-information-task-form-${taskId}`}
                    {...taskFormProps}
                />
            );
        }

        if (isPrivateOnboardingKycTask(task)) {
            return (
                <PrivateOnboardingKycTaskForm key={`private-onboarding-kyc-task-form-${taskId}`} {...taskFormProps} />
            );
        }

        if (isPersonUsTreatyEntitlementTask(task)) {
            return (
                <PersonUsTreatyEntitlementTaskForm
                    key={`person-us-treaty-entitlement-task-form-${taskId}`}
                    {...taskFormProps}
                />
            );
        }

        if (isSourcesOfWealthProofTask(task)) {
            return <SourcesOfWealthProofTaskForm key={`sources-of-wealth-task-form-${taskId}`} {...taskFormProps} />;
        }

        if (isSourcesOfWealthDeclarationTask(task)) {
            return (
                <SourcesOfWealthDeclarationTaskForm
                    key={`sources-of-wealth-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (isProofOfResidenceTask(task)) {
            return <ProofOfResidenceTaskForm key={`proof-of-residence-task-form-${taskId}`} {...taskFormProps} />;
        }

        if (isCompanyTinsTask(task)) {
            return (
                <CompanyTinsTaskForm
                    key={`company-tins-task-form-${taskId}`}
                    task={taskFormProps.task}
                    onFinishTask={taskFormProps.onFinishTask}
                    onSubmit={taskFormProps.onSubmit}
                />
            );
        }

        if (isCompanyUbosTask(task)) {
            return <CompanyUbosTaskForm key={`company-ubos-task-form-${taskId}`} {...taskFormProps} />;
        }

        if (isCompanyLegalRepresentativesTask(task)) {
            return (
                <CompanyLegalRepresentativesTaskForm
                    key={`company-legal-representatives-task-form-${taskId}`}
                    {...taskFormProps}
                />
            );
        }

        if (isCompanyBusinessActivitiesTask(task)) {
            return (
                <CompanyBusinessActivitiesTaskForm
                    key={`company-business-activities-task-form-${taskId}`}
                    {...taskFormProps}
                />
            );
        }

        if (isPhoneVerificationTask(task)) {
            return <PhoneVerificationTaskForm key={`phone-verification-task-form-${taskId}`} {...taskFormProps} />;
        }

        logWarningLocally('No task form found', task);
    };

    useEffect(() => {
        setIsDone(false);
        setTaskRejectionMessage(undefined);

        const task: TaskModel | undefined = getOpenedTask(tasksInfo, taskIdParam);

        if (task) {
            trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {
                page: getTaskFormVirtualPageLocation(task),
                taskType: task.taskType
            });
        }

        setTask(task);
    }, [taskIdParam]);

    useDocumentTitle(
        taskTitleTranslationCode && hasTranslation(i18n, taskTitleTranslationCode)
            ? localize(i18n, taskTitleTranslationCode)
            : 'DEGIRO'
    );

    if (!task) {
        return (
            <div className={gridStyles.row}>
                <Cell size={12} align="center">
                    <h1 className={taskStyles.pageMessageTitle}>{localize(i18n, 'taskManager.task.notFound')}</h1>
                </Cell>
                <Cell size={12} align="center">
                    <TasksLink />
                </Cell>
            </div>
        );
    }

    if (taskRejectionMessage) {
        return (
            <div className={gridStyles.row}>
                <div className={gridStyles.gutter} />
                <div className={gridStyles.gutter} />
                <Cell size={12} align="center">
                    <h2 className={taskStyles.pageMessageSubTitle}>{taskRejectionMessage}</h2>
                </Cell>
                <Cell size={12} align="center">
                    <TasksLink className={`${buttonStyles.button} ${taskStyles.taskResultButton}`} />
                </Cell>
            </div>
        );
    }

    if (isDone) {
        return (
            <div className={gridStyles.row}>
                <Cell className={gridStyles.gutter} />
                <Cell className={gridStyles.gutter} />
                <Cell size={12} align="center">
                    <h1 className={taskStyles.pageMessageTitle}>
                        {localize(i18n, 'taskManager.task.successResult.title')}
                    </h1>
                    <h2 className={taskStyles.pageMessageSubTitle}>
                        {localize(i18n, 'taskManager.task.successResult.message')}
                    </h2>
                </Cell>
                <Cell size={12} align="center">
                    <ProceedAfterTaskLink
                        tasksInfo={tasksInfo}
                        task={task}
                        className={`${buttonStyles.button} ${taskStyles.taskResultButton}`}
                    />
                </Cell>
            </div>
        );
    }

    return (
        <div className={gridStyles.row} data-task-type={task.taskType} data-task-id={task.taskId}>
            <Cell size={12}>
                <div className={taskStyles.content}>
                    <div className={gridStyles.row}>
                        <Cell size={12} className={taskStyles.taskCompletionWaring}>
                            <TaskDueDate
                                task={task}
                                label={localize(i18n, 'taskManager.task.completeBeforeRequirement')}
                            />
                        </Cell>
                    </div>
                    {renderTaskForm(task)}
                </div>
            </Cell>
        </div>
    );
};

export default React.memo(Task);
