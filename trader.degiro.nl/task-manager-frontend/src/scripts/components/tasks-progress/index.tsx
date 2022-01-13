import nbsp from 'frontend-core/dist/components/ui-common/component/nbsp';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {smallViewportMinWidth} from '../../media-queries';
import {TasksProgressInformation} from '../../models/tasks-progress';
import {I18nContext} from '../app-component/app-context';
import {
    compactLayoutContainer,
    compactLayoutItem,
    compactLayoutItemIndicator,
    container,
    list,
    listItem,
    listItemActive
} from './tasks-progress.css';

interface Props {
    tasksProgressInformation: TasksProgressInformation;
}

const {useContext} = React;
const TasksProgress: React.FunctionComponent<Props> = ({tasksProgressInformation}) => {
    const i18n = useContext(I18nContext);
    const hasCompactLayout: boolean = !useMediaQuery(smallViewportMinWidth);
    const {tasks, currentTask} = tasksProgressInformation;

    if (!currentTask) {
        return null;
    }

    const currentTasksIndex = tasks.indexOf(currentTask);
    const currentTaskNumber = currentTasksIndex + 1;
    const totalTasksCount = tasks.length;

    return (
        <div className={`${container} ${hasCompactLayout ? compactLayoutContainer : ''}`}>
            {!hasCompactLayout && (
                <ol className={list}>
                    {tasks.map((taskType: string) => (
                        <li key={taskType} className={`${listItem} ${taskType === currentTask ? listItemActive : ''}`}>
                            {localize(i18n, `task.${taskType}.title`)}
                        </li>
                    ))}
                </ol>
            )}
            {hasCompactLayout && (
                <div className={compactLayoutItem}>
                    <div
                        className={compactLayoutItemIndicator}
                        /* eslint-disable-next-line react/forbid-dom-props */
                        style={{width: `${(currentTaskNumber / totalTasksCount) * 100}%`}}
                    />
                    {currentTaskNumber}/{totalTasksCount}
                    {nbsp()}
                    {localize(i18n, `task.${currentTask}.title`)}
                </div>
            )}
        </div>
    );
};

export default React.memo(TasksProgress);
