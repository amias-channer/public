import createErrorHandler from './create-error-handler';
export default function verifyInBiometricKeychain(key, message) {
    return new Promise((resolve, reject) => {
        window.plugins.touchid.verify(key, message, resolve, createErrorHandler(reject));
    });
}
//# sourceMappingURL=verify-in-biometric-keychain.js.map