import isAppError from '../../services/app-error/is-app-error';
export default function isLoginFailuresError(error) {
    return isAppError(error) && error.loginFailures !== undefined;
}
//# sourceMappingURL=is-login-failures-error.js.map