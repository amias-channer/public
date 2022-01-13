import {FeedbackSource} from 'frontend-core/dist/models/feedback';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';

export default function getFeedbackSource(): FeedbackSource {
    return isTouchDevice() ? 'MOBILE_TRADER' : 'WEB_TRADER';
}
