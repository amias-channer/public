import {Task} from 'frontend-core/dist/models/task/task';
import isCashFundChoiceTask from 'frontend-core/dist/services/task/is-cash-fund-choice-task';

export default function hasOverdueTask(tasks: Task[]): boolean {
    return tasks.some((task: Task) => {
        return (
            task.isHardDeadlineMissed ||
            // [WF-1844] For CASH_FUND_CHOICE task we should look at `isHardDeadline` flag
            (task.isHardDeadline && isCashFundChoiceTask(task))
        );
    });
}
