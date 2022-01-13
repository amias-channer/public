import isAppError from './is-app-error';
/**
 * @description Check if error is only a container for child errors list
 * @param {Error|AppError|null|undefined} error
 * @returns {boolean}
 */
export default function isGroupAppError(error) {
    return Boolean(isAppError(error) && !error.code && !error.text && !error.field);
}
//# sourceMappingURL=is-group-app-error.js.map