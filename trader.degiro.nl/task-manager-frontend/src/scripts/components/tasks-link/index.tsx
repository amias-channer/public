import areComponentChildrenEmpty from 'frontend-core/dist/components/ui-common/component/are-component-children-empty';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Routes} from '../../navigation';
import {I18nContext} from '../app-component/app-context';

export interface TasksLinkProps {
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
}

const {useContext} = React;
const TasksLink: React.FunctionComponent<TasksLinkProps> = ({children, className}) => {
    const i18n = useContext(I18nContext);

    return (
        <Link to={Routes.TASKS} className={className}>
            {areComponentChildrenEmpty(children) ? localize(i18n, 'taskManager.task.redirectToTasks') : children}
        </Link>
    );
};

export default React.memo<React.PropsWithChildren<TasksLinkProps>>(TasksLink);
