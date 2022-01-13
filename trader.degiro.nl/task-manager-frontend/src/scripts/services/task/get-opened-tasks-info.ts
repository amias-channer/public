import {Task, TasksInfo} from 'frontend-core/dist/models/task/task';
import isActiveTraderAppropriatenessTestTask from 'frontend-core/dist/services/task/appropriateness-test/is-active-trader-appropriateness-test-task';
import isCertificateAppropriatenessTestTask from 'frontend-core/dist/services/task/appropriateness-test/is-certificate-appropriateness-test-task';
import isOnboardingAppropriatenessTestTask from 'frontend-core/dist/services/task/appropriateness-test/is-onboarding-appropriateness-test-task';
import getTasks from 'frontend-core/dist/services/task/get-tasks';
import isBankAccountVerificationTask from 'frontend-core/dist/services/task/is-bank-account-verification-task';
import isBetaTestParticipationTask from 'frontend-core/dist/services/task/is-beta-test-participation-task';
import isCashFundChoiceCzTask from 'frontend-core/dist/services/task/is-cash-fund-choice-cz-task';
import isCashFundChoicePlTask from 'frontend-core/dist/services/task/is-cash-fund-choice-pl-task';
import isCashFundChoiceTask from 'frontend-core/dist/services/task/is-cash-fund-choice-task';
import isCompanyApplicationReviewTask from 'frontend-core/dist/services/task/is-company-application-review-task';
import isCompanyBusinessActivitiesTask from 'frontend-core/dist/services/task/is-company-business-activities-task';
import isCompanyComplianceQuestionnaireTask from 'frontend-core/dist/services/task/is-company-compliance-questionnaire-task';
import isCompanyDocumentsReviewTask from 'frontend-core/dist/services/task/is-company-documents-review-task';
import isCompanyIncorporationDocumentsTask from 'frontend-core/dist/services/task/is-company-incorporation-documents-task';
import isCompanyInformationTask from 'frontend-core/dist/services/task/is-company-information-task';
import isCompanyLegalRepresentativesTask from 'frontend-core/dist/services/task/is-company-legal-representatives-task';
import isCompanyQuestionnaireTask from 'frontend-core/dist/services/task/is-company-questionnaire-task';
import isCompanyStructureDocumentsTask from 'frontend-core/dist/services/task/is-company-structure-documents-task';
import isCompanyUbosTask from 'frontend-core/dist/services/task/is-company-ubos-task';
import isFatcaPartnerTask from 'frontend-core/dist/services/task/is-fatca-partner-task';
import isFlatexAccountOpeningTask from 'frontend-core/dist/services/task/is-flatex-account-opening-task';
import isFlatexForeignAccountOpeningTask from 'frontend-core/dist/services/task/flatex-foreign-account-opening/is-flatex-foreign-account-opening-task';
import isFlatexMigrationTask from 'frontend-core/dist/services/task/is-flatex-migration-task';
import isFrenchDomesticTaxRegimeTask from 'frontend-core/dist/services/task/is-french-domestic-tax-regime-task';
import isIdUploadReviewTask from 'frontend-core/dist/services/task/is-id-upload-review-task';
import isKnowledgeQuestionnaireTask from 'frontend-core/dist/services/task/is-knowledge-questionnaire-task';
import isLeiTask from 'frontend-core/dist/services/task/is-lei-task';
import isOpenedTask from 'frontend-core/dist/services/task/is-opened-task';
import isPepDeclarationTask from 'frontend-core/dist/services/task/is-pep-declaration-task';
import isPepInstructionsTask from 'frontend-core/dist/services/task/is-pep-instructions-task';
import isPepQuestionTask from 'frontend-core/dist/services/task/is-pep-question-task';
import isPhoneVerificationTask from 'frontend-core/dist/services/task/is-phone-verification-task';
import isPrivateMissingAgreementsTask from 'frontend-core/dist/services/task/is-private-missing-agreements-task';
import isPrivateOnboardingAgreementsTask from 'frontend-core/dist/services/task/is-private-onboarding-agreements-task';
import isPrivateOnboardingInformationTask from 'frontend-core/dist/services/task/is-private-onboarding-information-task';
import isPrivateOnboardingKycTask from 'frontend-core/dist/services/task/is-private-onboarding-kyc-task';
import isPrivateUpgradeAgreementsTask from 'frontend-core/dist/services/task/is-private-upgrade-agreements-task';
import isProofOfResidenceTask from 'frontend-core/dist/services/task/is-proof-of-residence-task';
import isScreeningCompanyTask from 'frontend-core/dist/services/task/is-screening-company-task';
import isScreeningPersonTask from 'frontend-core/dist/services/task/is-screening-person-task';
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
import {Config} from '../../models/config';
import hasOverdueTask from './has-overdue-task';

export default function getOpenedTasksInfo(config: Config): Promise<TasksInfo> {
    return getTasks(config).then((tasksResponse: Task[]) => {
        const tasks: Task[] = tasksResponse.filter(isOpenedTask).filter((task: Task) => {
            return (
                isActiveTraderAppropriatenessTestTask(task) ||
                isBankAccountVerificationTask(task) ||
                isBetaTestParticipationTask(task) ||
                isCashFundChoiceCzTask(task) ||
                isCashFundChoicePlTask(task) ||
                isCashFundChoiceTask(task) ||
                isCertificateAppropriatenessTestTask(task) ||
                isCompanyApplicationReviewTask(task) ||
                isCompanyBusinessActivitiesTask(task) ||
                isCompanyComplianceQuestionnaireTask(task) ||
                isCompanyDocumentsReviewTask(task) ||
                isCompanyIncorporationDocumentsTask(task) ||
                isCompanyInformationTask(task) ||
                isCompanyLegalRepresentativesTask(task) ||
                isCompanyQuestionnaireTask(task) ||
                isCompanyStructureDocumentsTask(task) ||
                isCompanyTinsTask(task) ||
                isCompanyUbosTask(task) ||
                isCompanyUsTreatyEntitlementQuestionnaireTask(task) ||
                isCompanyUsTreatyEntitlementTask(task) ||
                isFatcaPartnerTask(task) ||
                isFrenchDomesticTaxRegimeTask(task) ||
                isFlatexAccountOpeningTask(task) ||
                isFlatexMigrationTask(task) ||
                isFlatexForeignAccountOpeningTask(task) ||
                isIdUploadReviewTask(task) ||
                isKnowledgeQuestionnaireTask(task) ||
                isLeiTask(task) ||
                isUploadIdMifidPartnerTask(task) ||
                isUploadIdMifidTask(task) ||
                isUploadIdPartnerTask(task) ||
                isUploadIdTask(task) ||
                isUsTreatyEntitlementAffidavitTask(task) ||
                isOnboardingAppropriatenessTestTask(task) ||
                isPepDeclarationTask(task) ||
                isPepInstructionsTask(task) ||
                isPepQuestionTask(task) ||
                isPersonTinsTask(task) ||
                isPhoneVerificationTask(task) ||
                isPrivateMissingAgreementsTask(task) ||
                isPrivateOnboardingAgreementsTask(task) ||
                isPrivateOnboardingInformationTask(task) ||
                isPrivateOnboardingKycTask(task) ||
                isPrivateUpgradeAgreementsTask(task) ||
                isPersonUsTreatyEntitlementTask(task) ||
                isProofOfResidenceTask(task) ||
                isScreeningCompanyTask(task) ||
                isScreeningPersonTask(task) ||
                isSourcesOfWealthProofTask(task) ||
                isSourcesOfWealthDeclarationTask(task)
            );
        });

        return {
            tasks,
            hasOverdueTask: hasOverdueTask(tasks)
        };
    });
}
