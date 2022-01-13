export var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["ACCOUNT_BLOCKED"] = "accountBlocked";
    ErrorCodes["ACCOUNT_BLOCKED_PASS_CODE"] = "accountBlockedPassCode";
    ErrorCodes["ACCOUNT_INCOMPLETE"] = "accountIncomplete";
    ErrorCodes["ACTIVATION_CODE_DOES_NOT_MATCH"] = "activationCodeDoesNotMatch";
    ErrorCodes["ADDRESS_CONFIRMATION_REQUIRED"] = "addressConfirmationRequired";
    // https://github.com/sjhoeksma/cordova-plugin-keychain-touch-id#android-quirks
    ErrorCodes["ANDROID_KEYSTORE_KEY_PERMANENTLY_INVALIDATED"] = "KeyPermanentlyInvalidatedException";
    ErrorCodes["BAD_CREDENTIALS"] = "badCredentials";
    ErrorCodes["CERTIFICATE_TEST_NEEDED"] = "certificateTestNeeded";
    ErrorCodes["CLIENT_IN_WAITING_LIST"] = "clientInWaitingList";
    ErrorCodes["CONFIRMATION_PASSWORD_DOES_NOT_MATCH"] = "confirmationPasswordDoesNotMatch";
    ErrorCodes["EMAIL_DOES_NOT_MATCH"] = "emailDoesNotMatch";
    ErrorCodes["EXCEEDED_FAVOURITES_PER_LIST_LIMIT"] = "exceededFavouritesPerListLimit";
    ErrorCodes["EXCEEDED_FAVOURITE_LISTS_LIMIT"] = "exceededFavouriteListsLimit";
    ErrorCodes["FAVOURITE_LIST_ALREADY_EXISTS"] = "favouriteListAlreadyExists";
    ErrorCodes["HTTP_AUTH"] = "HTTP_AUTH_ERROR";
    ErrorCodes["JOINT_ACCOUNT_PERSON_NEEDED"] = "jointAccountPersonNeeded";
    ErrorCodes["MAX_BANK_ACCOUNTS_NUMBER"] = "maxBankAccountsNumber";
    ErrorCodes["NEW_PASSWORD_SAME_AS_USERNAME"] = "newPasswordSameAsUsername";
    ErrorCodes["NO_FIELDS_CHANGED"] = "noFieldsChanged";
    ErrorCodes["PASSWORD_RESET"] = "passwordReset";
    ErrorCodes["PASS_CODE_RESET"] = "passCodeReset";
    ErrorCodes["PRODUCT_GOVERNANCE_SETTINGS_CHANGE_NEEDED"] = "settingsChangeNeeded";
    ErrorCodes["TASKS_WITH_MISSED_HARD_DEADLINE"] = "hasTasksWithMissedHardDeadline";
    ErrorCodes["TOTP_NEEDED"] = "totpNeeded";
    ErrorCodes["US_PERSON"] = "isUsPerson";
    ErrorCodes["VALIDATION"] = "validationError";
})(ErrorCodes || (ErrorCodes = {}));
/**
 * @description It's a class for in-app errors, created in services or based on API response
 * @class
 */
export class AppError extends Error {
    constructor({ code = '', text = '', field = '', errors = [], ...restProps } = {}) {
        super(text);
        this.name = 'AppError';
        this.code = '';
        this.field = '';
        this.text = '';
        /* eslint-disable max-len */
        /**
         * @todo: Fix after migration to ES 2018
         * @description
         * Override Error#toString to get a stringified object from String(appError), JSON.stringify(appError)
         *
         * It's very important when we log errors in Sentry or pass them via workers
         * We can't override `Error#toString` if we declare `toString` as a method of `AppError` class
         * due to specifics of TS compilation to ES5
         *
         * @see https://github.com/microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        /* eslint-enable max-len */
        this.toString = function () {
            return JSON.stringify(this);
        };
        // `restProps` may contain some additional fields (as in [WF-1237])
        Object.assign(this, restProps);
        const firstError = errors[0];
        // parse a single error
        if (errors.length === 1 && firstError.code !== ErrorCodes.VALIDATION) {
            Object.assign(this, firstError);
            this.code = firstError.code || code;
            this.text = firstError.text || text;
            this.field = firstError.field || '';
            this.errors = [];
        }
        else {
            this.code = code;
            this.text = text;
            this.field = field;
            this.errors = errors.map((error) => new AppError(error));
        }
    }
}
//# sourceMappingURL=app-error.js.map