import isInternalEnv from 'frontend-core/dist/platform/is-internal-env';

/**
 * @todo Remove this function when "US Plan" will be approved for production release
 * @returns {boolean}
 */
export default function isUsSubscriptionAvailable(): boolean {
    return isInternalEnv();
}
