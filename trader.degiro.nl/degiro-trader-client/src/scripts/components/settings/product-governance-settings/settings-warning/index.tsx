import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductGovernanceGroupTypes} from 'frontend-core/dist/models/product-governance';
import localize from 'frontend-core/dist/services/i18n/localize';
import getMissingProductGovernanceGroups from 'frontend-core/dist/services/product-governance/get-missing-product-governance-groups';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Statuses} from '../../../../models/status';
import {ConfigContext, I18nContext} from '../../../app-component/app-context';
import {ButtonVariants, getButtonClassName} from '../../../button';
import StatusBox from '../../../status/status-box';
import getProductGovernanceSettingsGroupUrl from './get-settings-group-url';
import localizeWarningTitle from './localize-warning-title';
import {navigationButton} from './settings-warning.css';

interface Props {
    className?: string;
    productInfo: ProductInfo;
    onAction(): void;
}

const {useState, useEffect, useContext} = React;
const settingsButtonClassName: string = getButtonClassName({
    variant: ButtonVariants.ACCENT,
    className: navigationButton
});
const ProductGovernanceSettingsWarning: React.FunctionComponent<Props> = ({productInfo, className, onAction}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const [groups, setGroups] = useState<ProductGovernanceGroupTypes[]>([]);

    useEffect(() => {
        // reset values for previous product
        setGroups([]);

        const groupsPromise = createCancellablePromise(getMissingProductGovernanceGroups(config, productInfo.id));

        groupsPromise.promise.then(setGroups).catch(logErrorLocally);

        return groupsPromise.cancel;
    }, [String(productInfo.id)]);

    if (!groups.length) {
        return null;
    }

    return (
        <StatusBox
            className={className}
            status={Statuses.WARNING}
            title={localizeWarningTitle(i18n, groups)}
            body={localize(i18n, 'trader.productGovernance.orderWarning.description')}>
            <Link
                className={settingsButtonClassName}
                to={getProductGovernanceSettingsGroupUrl(groups)}
                onClick={onAction}>
                {localize(i18n, 'trader.productGovernance.orderWarning.changeSettings')}
            </Link>
        </StatusBox>
    );
};

export default React.memo(ProductGovernanceSettingsWarning);
