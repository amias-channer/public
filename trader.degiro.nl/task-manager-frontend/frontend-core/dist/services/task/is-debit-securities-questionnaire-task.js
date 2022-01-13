export default function isDebitSecuritiesQuestionnaireTask(task) {
    return (task.taskType || '').indexOf('APPROPRIATENESS_TEST_DEBIT_SECURITIES') === 0;
}
//# sourceMappingURL=is-debit-securities-questionnaire-task.js.map