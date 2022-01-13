import {hiddenValue} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {ConfigContext, I18nContext} from '../../app-component/app-context';
import {nbsp} from '../../value';
import AbsoluteDifference from '../../value/absolute-difference';
import RelativeDifference from '../../value/relative-difference';
import {portfolioDiffSection, section, sectionLabel, sectionSubValue, sectionValue} from './sections.css';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';
import useAccountSummaryValueVisibility from '../hooks/use-account-summary-value-visibility';

const {useContext, memo} = React;
const PortfolioDiffForDay = memo(() => {
    const {totalPortfolio} = useTotalPortfolio();
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const [areValuesVisible] = useAccountSummaryValueVisibility();

    return (
        <div data-name="portfolioDayDiffButton" className={`${section} ${portfolioDiffSection}`}>
            <span className={`${sectionValue} ${areValuesVisible ? '' : hiddenValue}`}>
                <AbsoluteDifference
                    highlightValueChange={false}
                    id="totalPortfolio"
                    prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                    field="todayPl"
                    value={totalPortfolio.todayPl}
                />
                {/* backward compatibility with old API based on which we can't calculate todayRelativePl */}
                {totalPortfolio.todayRelativePl != null && (
                    <RelativeDifference
                        className={sectionSubValue}
                        brackets={true}
                        highlightValueChange={false}
                        id="totalPortfolio"
                        field="todayRelativePl"
                        value={totalPortfolio.todayRelativePl}
                    />
                )}
            </span>
            <span className={sectionLabel}>{localize(i18n, 'trader.totalPortfolio.todayPl')}</span>
        </div>
    );
});

PortfolioDiffForDay.displayName = 'PortfolioDiffForDay';
export default PortfolioDiffForDay;
