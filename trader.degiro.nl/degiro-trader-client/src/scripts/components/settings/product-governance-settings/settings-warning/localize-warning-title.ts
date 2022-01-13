import {I18n} from 'frontend-core/dist/models/i18n';
import {ProductGovernanceGroupTypes} from 'frontend-core/dist/models/product-governance';
import localize from 'frontend-core/dist/services/i18n/localize';

export default function localizeWarningTitle(i18n: I18n, groups: ProductGovernanceGroupTypes[]): string {
    return localize(i18n, 'trader.productGovernance.orderWarning.title', {
        groups: groups
            .map((group) => {
                return localize(i18n, `trader.productGovernance.groups.${group}.title`);
            })
            .join(', ')
    });
}
