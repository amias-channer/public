import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {Task} from 'frontend-core/dist/models/task/task';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import localize from 'frontend-core/dist/services/i18n/localize';
import getTaskTitle from 'frontend-core/dist/services/task/get-task-title';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Routes} from '../../navigation';
import getTaskFormsVirtualPageLocation from '../../services/analytics/get-task-forms-virtual-page-location';
import {I18nContext, TasksInfoContext} from '../app-component/app-context';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import SkipTaskLink from '../skip-task-link/index';
import TaskDueDate from '../task/due-date';
import TraderLink from './../../components/trader-link/index';
import {
    centerButtonsLine,
    lisItem,
    lisItemTitle,
    primaryListItem,
    subTitle,
    tasksActionButton,
    tasksList
} from './tasks.css';

const {useEffect, useContext} = React;
const Tasks: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const tasksInfo = useContext(TasksInfoContext);

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {
            taskType: undefined,
            page: `${getTaskFormsVirtualPageLocation()}/list`
        });
    }, []);

    useDocumentTitle(localize(i18n, 'translation.label.540'));

    const {tasks, hasOverdueTask} = tasksInfo;

    if (!tasks[0]) {
        return (
            <div className={gridStyles.row}>
                <Cell size={12} align="center">
                    <h2 className={subTitle}>{localize(i18n, 'taskManager.tasks.emptyTasksList')}</h2>
                </Cell>
                <Cell size={12} align="center">
                    <TraderLink />
                </Cell>
            </div>
        );
    }

    return (
        <div>
            <div className={gridStyles.row}>
                <Cell size={12} align="center">
                    <h2 className={subTitle} data-name="completeTasksRequirement">
                        <InnerHtml>{localize(i18n, 'taskManager.tasks.completeTasksRequirement')}</InnerHtml>
                    </h2>
                </Cell>
            </div>
            <div className={gridStyles.row}>
                <Cell size={12}>
                    <div className={tasksList}>
                        {tasks.map((task: Task) => {
                            const {taskId} = task;

                            return (
                                <Link
                                    to={`${Routes.TASKS}/${taskId}`}
                                    data-name="task"
                                    data-task-type={task.taskType}
                                    data-task-id={taskId}
                                    key={String(taskId)}
                                    className={`${lisItem} ${task.isHardDeadlineMissed ? primaryListItem : ''}`}>
                                    <span className={lisItemTitle}>
                                        {localize(i18n, getTaskTitle(task), task.taskAttributes)}
                                    </span>
                                    <TaskDueDate task={task} label={localize(i18n, 'taskManager.tasks.deadline')} />
                                </Link>
                            );
                        })}
                    </div>
                    <div className={centerButtonsLine}>
                        <Link to={`${Routes.TASKS}/${tasks[0].taskId}`} className={tasksActionButton}>
                            {localize(i18n, 'taskManager.tasks.completeTasks')}
                        </Link>
                    </div>
                    {hasOverdueTask ? null : (
                        <div className={centerButtonsLine}>
                            <SkipTaskLink />
                        </div>
                    )}
                </Cell>
            </div>
        </div>
    );
};

export default React.memo(Tasks);
