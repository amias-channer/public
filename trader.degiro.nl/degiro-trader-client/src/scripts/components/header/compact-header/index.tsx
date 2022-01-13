import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Routes} from '../../../navigation';
import {AppApiContext, I18nContext} from '../../app-component/app-context';
import AccountSummary from './account-summary';
import {controlButton, header} from './compact-header.css';

const {useContext} = React;
const CompactHeader: React.FunctionComponent = () => {
    const appApi = useContext(AppApiContext);
    const i18n = useContext(I18nContext);

    return (
        <div className={header} data-name="compactHeader">
            <AccountSummary />
            <button
                type="button"
                className={controlButton}
                data-name="menuButton"
                onClick={appApi.openDrawer}
                aria-label={localize(i18n, 'trader.navigation.settings')}>
                <Icon type="menu" />
            </button>
            <Link
                aria-label={localize(i18n, 'trader.navigation.products')}
                to={Routes.QUICK_SEARCH}
                className={controlButton}
                // data-name="quickSearchMenuItem" is needed for <ProductTour/>
                data-name="quickSearchMenuItem">
                <Icon type="products_outline" />
            </Link>
        </div>
    );
};

export default React.memo(CompactHeader);
