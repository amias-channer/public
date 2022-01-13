import createErrorHandler from './create-error-handler';
export default function deleteFromBiometricKeychain(key) {
    return new Promise((resolve, reject) => {
        window.plugins.touchid.delete(key, () => resolve(), createErrorHandler(reject));
    });
}
//# sourceMappingURL=delete-from-biometric-keychain.js.map