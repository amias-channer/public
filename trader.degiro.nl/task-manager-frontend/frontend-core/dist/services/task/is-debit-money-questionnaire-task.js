export default function isDebitMoneyQuestionnaireTask(task) {
    return (task.taskType || '').indexOf('APPROPRIATENESS_TEST_DEBIT_MONEY') === 0;
}
//# sourceMappingURL=is-debit-money-questionnaire-task.js.map