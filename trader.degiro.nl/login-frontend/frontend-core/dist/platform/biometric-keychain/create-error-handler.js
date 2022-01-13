import { AppError } from '../../models/app-error';
/**
 * @description This function should be used only as an utility of biometric-keychain services
 * @param {Handler<Error | AppError>} onError
 * @returns {Error|AppError}
 */
export default function createErrorHandler(onError) {
    return (error) => {
        // Save string errors as code and text,
        // e.g. 'KeyPermanentlyInvalidatedException', 'Invalid code', etc.
        // https://github.com/sjhoeksma/cordova-plugin-keychain-touch-id#android-quirks
        onError(typeof error === 'string' ? new AppError({ code: error, text: error }) : error);
    };
}
//# sourceMappingURL=create-error-handler.js.map