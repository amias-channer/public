import {Task, TasksInfo} from 'frontend-core/dist/models/task/task';

export default function getOpenedTask(tasksInfo: TasksInfo, taskId: string): Task | undefined {
    return tasksInfo.tasks.find((task: Task) => String(task.taskId) === taskId);
}
