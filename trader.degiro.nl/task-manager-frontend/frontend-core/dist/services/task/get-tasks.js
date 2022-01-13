import requestToApi from '../api-requester/request-to-api';
const prepareTask = (originTask) => ({
    ...originTask,
    // `isCompletableByClient` can be undefined in the old API
    isCompletableByClient: originTask.isCompletableByClient !== false,
    dueDate: originTask.dueDate ? new Date(String(originTask.dueDate)) : undefined
});
export default async function getTasks(config) {
    const response = await requestToApi({
        config,
        url: `${config.paUrl}clienttasks`
    });
    return response.map(prepareTask);
}
//# sourceMappingURL=get-tasks.js.map