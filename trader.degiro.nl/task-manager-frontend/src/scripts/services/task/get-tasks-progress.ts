import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {TasksProgressInformation} from '../../models/tasks-progress';

export default function getTasksProgress(config: Config): Promise<TasksProgressInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}/clienttasks/tasks-progress`
    });
}
