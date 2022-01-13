import isPhone from 'frontend-core/dist/platform/is-phone';
import {AppParams} from '../../models/app-params';

export default function shouldUseMobileVersion(appParams: AppParams): boolean {
    return isPhone() || typeof appParams.mobile !== 'undefined';
}
