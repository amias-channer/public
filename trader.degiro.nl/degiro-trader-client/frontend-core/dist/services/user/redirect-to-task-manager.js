import isWebViewApp from '../../platform/is-web-view-app';
import getQueryString from '../../utils/url/get-query-string';
export default function redirectToTaskManager(config, options) {
    const intAccount = options && options.intAccount;
    const taskId = options && options.taskId;
    window.location.replace(`${config.taskManagerUrl}?${getQueryString({
        mobile: isWebViewApp() ? 'true' : undefined,
        intAccount
    })}${taskId === undefined ? '' : `#/tasks/${taskId}`}`);
}
//# sourceMappingURL=redirect-to-task-manager.js.map