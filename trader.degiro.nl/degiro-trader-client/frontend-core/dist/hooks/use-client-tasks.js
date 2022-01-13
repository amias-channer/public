import { useEffect, useState } from 'react';
import getTasks from '../services/task/get-tasks';
import createCancellablePromise from '../utils/async/create-cancellable-promise';
export default function useClientTasks(config) {
    const [state, setState] = useState({ isLoading: true, tasks: [] });
    useEffect(() => {
        const tasksPromise = createCancellablePromise(getTasks(config));
        tasksPromise.promise
            .then((tasks) => setState({ isLoading: false, tasks }))
            .catch((error) => setState({ isLoading: false, tasks: [], error }));
        return tasksPromise.cancel;
    }, []);
    return state;
}
//# sourceMappingURL=use-client-tasks.js.map