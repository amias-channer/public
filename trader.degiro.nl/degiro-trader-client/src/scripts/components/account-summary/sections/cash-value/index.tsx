import {hiddenValue} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import {Position} from 'frontend-core/dist/models/product';
import isJointCashPosition from 'frontend-core/dist/services/position/is-joint-cash-position';
import isProductCurrencyPosition from 'frontend-core/dist/services/position/is-product-currency-position';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import usePortfolioPositions from '../../../../hooks/use-portfolio-positions';
import {ConfigContext} from '../../../app-component/app-context';
import {nbsp} from '../../../value';
import Amount from '../../../value/amount';
import {section as sectionClassName, sectionValue} from '../sections.css';
import CashPositionInfo from './cash-position-info';
import useTotalPortfolio from '../../../../hooks/use-total-portfolio';
import useAccountSummaryValueVisibility from '../../hooks/use-account-summary-value-visibility';

interface Props {
    isColumnContext: boolean;
}

const {useContext, memo} = React;
const CashValueSection = memo<Props>(({isColumnContext}) => {
    const [areValuesVisible] = useAccountSummaryValueVisibility();
    const {totalPortfolio} = useTotalPortfolio();
    const {baseCurrency} = useContext(ConfigContext);
    const {positions} = usePortfolioPositions(
        undefined,
        (position: Position): boolean =>
            isJointCashPosition(position) && isProductCurrencyPosition(position, baseCurrency)
    );
    const baseCurrencyCashPosition: Position | undefined = positions[0];

    if (baseCurrencyCashPosition) {
        return (
            <CashPositionInfo
                isColumnContext={isColumnContext}
                totalPortfolio={totalPortfolio}
                position={baseCurrencyCashPosition}>
                <Amount
                    className={`${sectionValue} ${areValuesVisible ? '' : hiddenValue}`}
                    id="totalPortfolio"
                    prefix={`${getCurrencySymbol(baseCurrency)}${nbsp}`}
                    field="totalCash"
                    value={totalPortfolio.totalCash}
                />
            </CashPositionInfo>
        );
    }

    return (
        <section className={sectionClassName}>
            <Amount
                className={`${sectionValue} ${areValuesVisible ? '' : hiddenValue}`}
                id="totalPortfolio"
                prefix={`${getCurrencySymbol(baseCurrency)}${nbsp}`}
                field="totalCash"
                value={totalPortfolio.totalCash}
            />
        </section>
    );
});

CashValueSection.displayName = 'CashValueSection';
export default CashValueSection;
