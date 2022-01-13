import {Task} from 'frontend-core/dist/models/task/task';
import isKnowledgeQuestionnaireTask from 'frontend-core/dist/services/task/is-knowledge-questionnaire-task';
import isPrivateOnboardingAgreementsTask from 'frontend-core/dist/services/task/is-private-onboarding-agreements-task';

/**
 * @description do not send an event for the tasks that have their own 'taskComplete' triggers
 * @param {Task} task
 * @returns {boolean}
 */
export default function shouldSendGenericTaskCompleteEvent(task: Task): boolean {
    return !isPrivateOnboardingAgreementsTask(task) && !isKnowledgeQuestionnaireTask(task);
}
