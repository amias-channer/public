import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import useClientTasks from 'frontend-core/dist/hooks/use-client-tasks';
import {Task} from 'frontend-core/dist/models/task/task';
import localize from 'frontend-core/dist/services/i18n/localize';
import getTaskTitle from 'frontend-core/dist/services/task/get-task-title';
import formatDate from 'frontend-core/dist/utils/date/format-date';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Routes} from '../../../../navigation';
import {ConfigContext, I18nContext} from '../../../app-component/app-context';
import {ButtonVariants, getButtonClassName} from '../../../button';
import {
    actionButton,
    alert as baseAlert,
    closableAlert,
    content,
    fullPageAlert
} from '../../../inbox/alerts/alerts.css';
import AlertCloseButton from '../../../inbox/alerts/close-button';
import {alertStatusText} from '../../../status/status.css';
import {nbsp} from '../../../value';
import {alert, alertTitle} from './opened-tasks-alert.css';

const actionButtonClassName: string = getButtonClassName({
    variant: ButtonVariants.ACCENT,
    className: actionButton
});

interface Props {
    closable?: boolean;
}

const {useState, useCallback, useContext} = React;
const maxVisibleTasksCount: number = 2;
const OpenedTasksAlert: React.FunctionComponent<Props> = ({closable = true}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const {tasks} = useClientTasks(config);
    const visibleTasks: Task[] = tasks.filter((task: Task) => task.isVisibleInTraderAlerts);
    const closeAlert = useCallback(() => setIsVisible(false), []);
    const renderTaskTitle = (task: Task): string => {
        return [
            localize(i18n, getTaskTitle(task), task.taskAttributes),
            task.dueDate ? ` (${formatDate(task.dueDate, 'DD/MM/YYYY')})` : ''
        ].join('');
    };
    const visibleTasksCount: number = visibleTasks.length;

    if (isVisible && visibleTasksCount) {
        return (
            <div
                data-name="openedTasksAlert"
                className={`${baseAlert} ${alert} ${closable ? closableAlert : ''} ${fullPageAlert}`}>
                <Icon className={alertStatusText} type="bullet" />
                <span className={content}>
                    <span className={alertTitle}>
                        {localize(i18n, 'trader.onlineForms.openOnlineForms')}
                        {': '}
                    </span>
                    {tasks.slice(0, visibleTasksCount).map(renderTaskTitle).join(', ')}
                    {visibleTasksCount > maxVisibleTasksCount && `${nbsp}...`}
                </span>
                <Link to={Routes.ONLINE_FORMS} data-name="startTestButton" className={actionButtonClassName}>
                    {localize(i18n, 'taskManager.tasks.completeTasks')}
                </Link>
                {closable && <AlertCloseButton onClick={closeAlert} />}
            </div>
        );
    }

    return null;
};

export default React.memo(OpenedTasksAlert);
