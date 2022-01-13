import isActiveTraderAppropriatenessTestTask from './appropriateness-test/is-active-trader-appropriateness-test-task';
import isCertificateAppropriatenessTestTask from './appropriateness-test/is-certificate-appropriateness-test-task';
import isOnboardingAppropriatenessTestTask from './appropriateness-test/is-onboarding-appropriateness-test-task';
export default function isKnowledgeQuestionnaireTask(task) {
    return ((task.taskType || '').indexOf('APPROPRIATENESS_TEST_') === 0 &&
        !isActiveTraderAppropriatenessTestTask(task) &&
        !isOnboardingAppropriatenessTestTask(task) &&
        !isCertificateAppropriatenessTestTask(task));
}
//# sourceMappingURL=is-knowledge-questionnaire-task.js.map