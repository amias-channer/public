import {hiddenValue} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {ConfigContext, I18nContext} from '../../app-component/app-context';
import {nbsp} from '../../value';
import AbsoluteDifference from '../../value/absolute-difference';
import {portfolioDiffSection, section, sectionLabel, sectionValue} from './sections.css';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';
import useAccountSummaryValueVisibility from '../hooks/use-account-summary-value-visibility';

const {useContext, memo} = React;
const PortfolioDiffForAllTime = memo(() => {
    const {totalPortfolio} = useTotalPortfolio();
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const [areValuesVisible] = useAccountSummaryValueVisibility();

    return (
        <div data-name="portfolioTotalDiffButton" className={`${section} ${portfolioDiffSection}`}>
            <AbsoluteDifference
                className={`${sectionValue} ${areValuesVisible ? '' : hiddenValue}`}
                highlightValueChange={false}
                id="totalPortfolio"
                prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                field="totalPl"
                value={totalPortfolio.totalPl}
            />
            <span className={sectionLabel}>{localize(i18n, 'trader.totalPortfolio.totalPl')}</span>
        </div>
    );
});

PortfolioDiffForAllTime.displayName = 'PortfolioDiffForAllTime';
export default PortfolioDiffForAllTime;
