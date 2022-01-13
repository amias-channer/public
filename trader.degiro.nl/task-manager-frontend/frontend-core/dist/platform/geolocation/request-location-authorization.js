import { AppError } from '../../models/app-error';
const createErrorHandler = (reject) => (error) => {
    reject(typeof error === 'string' ? new AppError({ text: error }) : error);
};
// https://github.com/dpa99c/cordova-diagnostic-plugin#getlocationauthorizationstatus
// https://github.com/dpa99c/cordova-diagnostic-plugin#requestlocationauthorization
export default async function requestLocationAuthorization() {
    const diagnostic = window.cordova.plugins.diagnostic;
    const { permissionStatus, locationAuthorizationMode } = diagnostic;
    await new Promise((resolve, reject) => {
        const onError = createErrorHandler(reject);
        // https://github.com/dpa99c/cordova-diagnostic-plugin#islocationenabled
        // before requesting for getting location authorization status, we should check
        // the device setting for location is enabled
        diagnostic.isLocationEnabled((isLocationEnabled) => {
            if (isLocationEnabled) {
                return resolve(isLocationEnabled);
            }
            onError('errors.appPermissions.enableGps');
        }, onError);
    });
    const status = await new Promise((resolve, reject) => {
        diagnostic.getLocationAuthorizationStatus(resolve, createErrorHandler(reject));
    });
    if (status === permissionStatus.GRANTED || status === permissionStatus.GRANTED_WHEN_IN_USE) {
        return;
    }
    await new Promise((resolve, reject) => {
        diagnostic.requestLocationAuthorization(resolve, createErrorHandler(reject), locationAuthorizationMode.ALWAYS);
    });
}
//# sourceMappingURL=request-location-authorization.js.map