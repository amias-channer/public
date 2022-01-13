import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';

export default function canUseNativeDatepickerElement(): boolean {
    return isTouchDevice();
}
