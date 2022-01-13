import {hiddenValue} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {hidingUnderlineLink} from '../../../../styles/link.css';
import {Routes} from '../../../navigation';
import {ConfigContext, I18nContext} from '../../app-component/app-context';
import {nbsp} from '../../value';
import Amount from '../../value/amount';
import {section as sectionClassName, sectionLabel, sectionValue} from './sections.css';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';
import useAccountSummaryValueVisibility from '../hooks/use-account-summary-value-visibility';

const {useContext, memo} = React;
const PortfolioValue = memo(() => {
    const {totalPortfolio} = useTotalPortfolio();
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const [areValuesVisible] = useAccountSummaryValueVisibility();

    return (
        <Link to={Routes.PORTFOLIO} className={sectionClassName}>
            <Amount
                className={`${sectionValue} ${areValuesVisible ? '' : hiddenValue}`}
                id="totalPortfolio"
                prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                field="portfolio"
                value={totalPortfolio.portfolio}
            />
            <span className={`${sectionLabel} ${hidingUnderlineLink}`}>
                {localize(i18n, 'trader.totalPortfolio.portfolio')}
            </span>
        </Link>
    );
});

PortfolioValue.displayName = 'PortfolioValue';
export default PortfolioValue;
