import areComponentChildrenEmpty from 'frontend-core/dist/components/ui-common/component/are-component-children-empty';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {Task} from 'frontend-core/dist/models/task/task';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import skipTask from '../../services/task/skip-task';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import TraderLink from '../trader-link/index';

export interface SkipTaskLinkProps {
    task?: Task;
    className?: string;
}

const {useState, useContext} = React;
const SkipTaskLink: React.FunctionComponent<SkipTaskLinkProps> = ({task, children, className}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const [isSkipping, setIsSkipping] = useState<boolean>(false);
    const onSkipLinkClick = (task: Task, event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setIsSkipping(true);

        const {href} = event.currentTarget;

        skipTask(config, task).catch(logErrorLocally);

        // wait when the `skipTask` request will be sent
        setTimeout(() => location.replace(href), 100);
    };

    return (
        <TraderLink
            className={className}
            task={task}
            onClick={task && !isSkipping ? onSkipLinkClick.bind(null, task) : undefined}>
            {areComponentChildrenEmpty(children) ? localize(i18n, 'taskManager.tasks.finishLater') : children}
        </TraderLink>
    );
};

export default React.memo<React.PropsWithChildren<SkipTaskLinkProps>>(SkipTaskLink);
