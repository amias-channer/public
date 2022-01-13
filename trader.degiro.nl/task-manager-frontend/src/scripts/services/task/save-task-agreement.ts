import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {TaskResult} from '../../models/task';

export default function saveTaskAgreement(config: Config, task: Task): Promise<TaskResult> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/agreement/${task.taskId}`,
        method: 'POST'
    });
}
