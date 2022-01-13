import createErrorHandler from './create-error-handler';
export default function saveToBiometricKeychain(key, value) {
    return new Promise((resolve, reject) => {
        window.plugins.touchid.save(key, value, () => resolve(), createErrorHandler(reject));
    });
}
//# sourceMappingURL=save-to-biometric-keychain.js.map