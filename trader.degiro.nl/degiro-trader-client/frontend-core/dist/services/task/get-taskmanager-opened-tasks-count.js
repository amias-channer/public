import requestToApi from '../api-requester/request-to-api';
export default function getTaskManagerOpenedTasksCount(config) {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/taskmanager/count`
    }).then((response) => {
        const openedTasksCount = Number(response);
        return {
            value: isNaN(openedTasksCount) ? 0 : openedTasksCount
        };
    });
}
//# sourceMappingURL=get-taskmanager-opened-tasks-count.js.map