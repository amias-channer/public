export default function getTaskTitle({ taskType, descriptionCode }) {
    return taskType ? `task.${taskType}.title` : descriptionCode || '';
}
//# sourceMappingURL=get-task-title.js.map