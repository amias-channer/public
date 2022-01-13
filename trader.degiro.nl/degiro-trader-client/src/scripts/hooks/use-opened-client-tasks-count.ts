import {AppError} from 'frontend-core/dist/models/app-error';
import getTaskManagerOpenedTasksCount from 'frontend-core/dist/services/task/get-taskmanager-opened-tasks-count';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import {useContext, useEffect, useState} from 'react';
import {ConfigContext} from '../components/app-component/app-context';

interface State {
    isLoading: boolean;
    value: number;
    error?: Error | AppError;
}

export default function useOpenedClientTasksCount(): State {
    const config = useContext(ConfigContext);
    const [state, setState] = useState<State>({isLoading: true, value: 0});

    useEffect(() => {
        const tasksCountPromise = createCancellablePromise(getTaskManagerOpenedTasksCount(config));

        tasksCountPromise.promise
            .then((response) => setState({isLoading: false, value: response.value}))
            .catch((error: Error | AppError) => setState({isLoading: false, value: 0, error}));

        return tasksCountPromise.cancel;
    }, []);

    return state;
}
