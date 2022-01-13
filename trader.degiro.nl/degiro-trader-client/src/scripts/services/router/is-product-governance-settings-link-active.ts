import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isProductGovernanceSettingsLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.PRODUCT_GOVERNANCE_SETTINGS) === 0;
}
