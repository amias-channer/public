import { AppError } from '../../models/app-error';
// https://github.com/dpa99c/cordova-diagnostic-plugin#requestcameraauthorization
export default function requestCameraAuthorization() {
    return new Promise((resolve, reject) => {
        window.cordova.plugins.diagnostic.requestCameraAuthorization(() => resolve(), (error) => {
            reject(typeof error === 'string' ? new AppError({ text: error }) : error);
        }, { externalStorage: false });
    });
}
//# sourceMappingURL=request-camera-authorization.js.map