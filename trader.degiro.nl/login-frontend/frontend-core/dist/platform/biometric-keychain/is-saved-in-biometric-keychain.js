import createErrorHandler from './create-error-handler';
export default function isSavedInBiometricKeychain(key) {
    return new Promise((resolve, reject) => {
        window.plugins.touchid.has(key, () => resolve(), createErrorHandler(reject));
    });
}
//# sourceMappingURL=is-saved-in-biometric-keychain.js.map