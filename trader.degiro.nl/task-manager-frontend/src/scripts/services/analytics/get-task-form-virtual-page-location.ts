import {Task} from 'frontend-core/dist/models/task/task';
import getTaskFormsVirtualPageLocation from './get-task-forms-virtual-page-location';

export default function getTaskFormVirtualPageLocation(task: Task): string {
    return `${getTaskFormsVirtualPageLocation()}/form/${task.taskType.toLowerCase()}`;
}
