import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {ProductGovernanceGroupTypes} from 'frontend-core/dist/models/product-governance';

export default function getProductGovernanceSettingsGroupUrl([firstGroup]: ProductGovernanceGroupTypes[]): string {
    return `${Routes.PRODUCT_GOVERNANCE_SETTINGS}${firstGroup ? `?group=${firstGroup}` : ''}`;
}
