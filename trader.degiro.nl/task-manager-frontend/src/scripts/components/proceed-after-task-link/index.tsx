import {Task, TasksInfo} from 'frontend-core/dist/models/task/task';
import isOpenedTask from 'frontend-core/dist/services/task/is-opened-task';
import * as React from 'react';
import TasksLink, {TasksLinkProps} from '../tasks-link/index';
import TraderLink, {TraderLinkProps} from '../trader-link/index';

type LinkProps = TasksLinkProps | TraderLinkProps;
type Props = {
    task: Task;
    tasksInfo: TasksInfo;
} & LinkProps;

const ProceedAfterTaskLink: React.FunctionComponent<Props> = (props) => {
    const Link: typeof TasksLink | typeof TraderLink = props.tasksInfo.tasks.some(isOpenedTask)
        ? TasksLink
        : TraderLink;

    return <Link {...props} />;
};

export default React.memo(ProceedAfterTaskLink);
