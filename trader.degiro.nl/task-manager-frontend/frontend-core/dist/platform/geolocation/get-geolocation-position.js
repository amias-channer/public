import { AppError } from '../../models/app-error';
export default function getGeolocationPosition() {
    return new Promise((resolve, reject) => {
        // [CLM-1264] `getGeolocationPosition` can be broken when user GPS is disabled and
        // can just stuck without any response, so we need a timeout hack to prevent having infinite unresolved promise
        const cancelTimerId = setTimeout(() => reject(new AppError({ text: 'errors.appPermissions.enableGps' })), 4000);
        navigator.geolocation.getCurrentPosition((position) => {
            clearTimeout(cancelTimerId);
            resolve(position.coords);
        }, reject);
    });
}
//# sourceMappingURL=get-geolocation-position.js.map