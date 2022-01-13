import {AppError} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import isRequestTimeoutError from 'frontend-core/dist/services/app-error/is-request-timeout-error';
import {Config} from '../../models/config';
import {TaskStatus, TaskStatusInformation} from '../../models/private-onboarding-kyc-task';
import getTaskUpdatedStatusInformation from './get-task-updated-status-information';

type ResultCallback = (error: null | Error | AppError, taskStatusInformation?: TaskStatusInformation) => void;

export default function waitTaskSettledStatus(config: Config, task: Task, callback: ResultCallback): () => void {
    let timeId: number | undefined;
    const checkTaskStatus = () => {
        getTaskUpdatedStatusInformation(config, task)
            .then((taskStatusInformation: TaskStatusInformation) => {
                // polling is stopped
                if (timeId === undefined) {
                    return;
                }

                if (taskStatusInformation.status !== TaskStatus.PENDING) {
                    return callback(null, taskStatusInformation);
                }

                timeId = window.setTimeout(checkTaskStatus, 10_000);
            })
            .catch((error: Error | AppError) => {
                if (isRequestTimeoutError(error)) {
                    checkTaskStatus();
                    return;
                }

                callback(error);
            });
    };

    timeId = window.setTimeout(checkTaskStatus, 0);
    return () => {
        clearTimeout(timeId);
        timeId = undefined;
    };
}
