import formatDate from 'frontend-core/dist/utils/date/format-date';
import {Task} from 'frontend-core/dist/models/task/task';
import * as React from 'react';
import {taskDeadlineWarning} from './task.css';

export interface TaskDueDateProps {
    task: Task;
    label?: React.ReactNode | React.ReactNode[];
}

const TaskDueDate: React.FunctionComponent<TaskDueDateProps> = ({task, label}) => {
    const {dueDate} = task;

    if (dueDate) {
        return (
            <span
                data-name="taskDueDate"
                data-id={task.taskId}
                className={task.isHardDeadline ? taskDeadlineWarning : undefined}>
                {label}
                &nbsp;
                {formatDate(dueDate, 'DD/MM/YYYY')}
            </span>
        );
    }

    return null;
};

export default TaskDueDate;
