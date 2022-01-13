import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';

export default function skipTask(config: Config, task: Task): Promise<void> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/skipTask/${task.taskId}`,
        method: 'POST'
    });
}
