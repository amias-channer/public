import { ErrorCodes } from '../../models/app-error';
import isAppError from './is-app-error';
export default function isTaskManagerDeadlineError(error) {
    return isAppError(error) && error.code === ErrorCodes.TASKS_WITH_MISSED_HARD_DEADLINE;
}
//# sourceMappingURL=is-task-manager-deadline-error.js.map