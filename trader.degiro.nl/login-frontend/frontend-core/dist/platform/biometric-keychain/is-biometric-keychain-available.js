import createErrorHandler from './create-error-handler';
export default function isBiometricKeychainAvailable() {
    return new Promise((resolve, reject) => {
        window.plugins.touchid.isAvailable(() => resolve(), createErrorHandler(reject));
    });
}
//# sourceMappingURL=is-biometric-keychain-available.js.map