import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import {hiddenValue} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {ConfigContext, I18nContext} from '../../app-component/app-context';
import {nbsp} from '../../value';
import Amount from '../../value/amount';
import {section as sectionClassName, sectionLabel, sectionValue} from './sections.css';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';
import useAccountSummaryValueVisibility from '../hooks/use-account-summary-value-visibility';

const {useContext, memo} = React;
const PortfolioBalance: React.FunctionComponent = memo(() => {
    const [areValuesVisible] = useAccountSummaryValueVisibility();
    const {totalPortfolio} = useTotalPortfolio();
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);

    return (
        <section className={sectionClassName}>
            <Amount
                className={`${sectionValue} ${areValuesVisible ? '' : hiddenValue}`}
                id="totalPortfolio"
                prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                field="total"
                value={totalPortfolio.total}
            />
            <span className={sectionLabel}>{localize(i18n, 'trader.totalPortfolio.total')}</span>
        </section>
    );
});

PortfolioBalance.displayName = 'PortfolioBalance';
export default PortfolioBalance;
