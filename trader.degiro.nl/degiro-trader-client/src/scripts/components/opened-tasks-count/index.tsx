import * as React from 'react';
import useOpenedClientTasksCount from '../../hooks/use-opened-client-tasks-count';
import Badge from '../badge';

interface Props {
    className?: string;
    children?: React.ReactElement | ((tasksCount: number) => React.ReactElement);
}

// I have no idea how and why it works. But it works. (Mykhailo Ivankiv)
// https://medium.com/@martin_hotell/react-children-composition-patterns-with-typescript-56dfc8923c64
type IsFunction<T> = T extends (...args: any[]) => any ? T : never;
const isFunction = <T extends {}>(value: T): value is IsFunction<T> => typeof value === 'function';
const OpenedTasksCount: React.FunctionComponent<Props> = ({children, className}) => {
    const {value: tasksCount} = useOpenedClientTasksCount();

    if (!tasksCount) {
        return null;
    }

    if (!children) {
        return <Badge className={className}>{tasksCount}</Badge>;
    }

    return isFunction(children) ? children(tasksCount) : children;
};

export default React.memo<React.PropsWithChildren<Props>>(OpenedTasksCount);
