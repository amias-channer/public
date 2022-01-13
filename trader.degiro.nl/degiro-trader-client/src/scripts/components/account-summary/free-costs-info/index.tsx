import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {TotalPortfolioData} from 'frontend-core/dist/models/total-portfolio';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import {
    cell,
    centerContentCell,
    headerCell,
    inlineEndContentCell,
    row,
    table as tableClassName
} from '../../table/table.css';
import Hint from '../../hint';
import Amount from '../../value/amount';

interface Props {
    totalPortfolio: Partial<TotalPortfolioData>;
}

const {useContext} = React;
const FreeCostsInfo: React.FunctionComponent<Props> = ({totalPortfolio}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const valueSourceId: string = 'totalPortfolio';
    const {hasMarginReport, hasOvernightReport} = currentClient;
    const baseCurrencyCell: React.ReactNode = (
        <td className={`${cell} ${centerContentCell}`}>{getCurrencySymbol(config.baseCurrency)}</td>
    );

    return (
        <table className={tableClassName}>
            <thead>
                <tr className={row}>
                    <th className={headerCell}>
                        <span>{localize(i18n, 'trader.freeCostsInfo.marginStatement')} </span>
                        <Hint
                            className={inlineRight}
                            content={localize(i18n, 'trader.freeCostsInfo.marginStatementHint')}
                        />
                    </th>
                    <th className={headerCell} />
                    {hasOvernightReport && (
                        <th className={headerCell}>
                            {hasMarginReport && (
                                <span>{localize(i18n, 'trader.freeCostsInfo.overnightStatement')} </span>
                            )}
                            {hasMarginReport && (
                                <Hint
                                    className={inlineRight}
                                    content={localize(i18n, 'trader.freeCostsInfo.overnightStatementHint')}
                                />
                            )}
                        </th>
                    )}
                    {hasMarginReport && (
                        <th className={headerCell}>
                            {hasOvernightReport && (
                                <span>{localize(i18n, 'trader.freeCostsInfo.intradayStatement')} </span>
                            )}
                            {hasOvernightReport && (
                                <Hint
                                    className={inlineRight}
                                    content={localize(i18n, 'trader.freeCostsInfo.intradayStatementHint')}
                                />
                            )}
                        </th>
                    )}
                    <th className={headerCell} />
                </tr>
            </thead>
            <tbody>
                <tr className={row}>
                    <td className={cell}>{localize(i18n, 'trader.freeCostsInfo.portfolioValue')}</td>
                    {baseCurrencyCell}
                    {hasOvernightReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportEodPortfValue}
                                field="reportEodPortfValue"
                            />
                        </td>
                    )}
                    {hasMarginReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportPortfValue}
                                field="reportPortfValue"
                            />
                        </td>
                    )}
                    <td className={`${cell} ${centerContentCell}`}>
                        <Hint content={localize(i18n, 'trader.freeCostsInfo.portfolioValueHint')} />
                    </td>
                </tr>
                <tr className={row}>
                    <td className={cell}>{localize(i18n, 'trader.freeCostsInfo.cashValue')}</td>
                    {baseCurrencyCell}
                    {hasOvernightReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportEodCashBal}
                                field="reportEodCashBal"
                            />
                        </td>
                    )}
                    {hasMarginReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount id={valueSourceId} value={totalPortfolio.reportCashBal} field="reportCashBal" />
                        </td>
                    )}
                    <td className={`${cell} ${centerContentCell}`}>
                        <Hint content={localize(i18n, 'trader.freeCostsInfo.cashValueHint')} />
                    </td>
                </tr>
                <tr className={row}>
                    <td className={cell}>{localize(i18n, 'trader.freeCostsInfo.liquidity')}</td>
                    {baseCurrencyCell}
                    {hasOvernightReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount id={valueSourceId} value={totalPortfolio.reportEodNetliq} field="reportEodNetliq" />
                        </td>
                    )}
                    {hasMarginReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount id={valueSourceId} value={totalPortfolio.reportNetliq} field="reportNetliq" />
                        </td>
                    )}
                    <td className={`${cell} ${centerContentCell}`}>
                        <Hint content={localize(i18n, 'trader.freeCostsInfo.liquidityHint')} />
                    </td>
                </tr>
                <tr className={row}>
                    <td className={cell}>{localize(i18n, 'trader.freeCostsInfo.riskPortfolio')}</td>
                    {baseCurrencyCell}
                    {hasOvernightReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportEodOverallMargin}
                                field="reportEodOverallMargin"
                            />
                        </td>
                    )}
                    {hasMarginReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportOverallMargin}
                                field="reportOverallMargin"
                            />
                        </td>
                    )}
                    <td className={`${cell} ${centerContentCell}`}>
                        <Hint content={localize(i18n, 'trader.freeCostsInfo.riskPortfolioHint')} />
                    </td>
                </tr>
                <tr className={row}>
                    <td className={cell}>{localize(i18n, 'trader.freeCostsInfo.margin')}</td>
                    {baseCurrencyCell}
                    {hasOvernightReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount id={valueSourceId} value={totalPortfolio.reportEodMargin} field="reportEodMargin" />
                        </td>
                    )}
                    {hasMarginReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount id={valueSourceId} value={totalPortfolio.reportMargin} field="reportMargin" />
                        </td>
                    )}
                    <td className={`${cell} ${centerContentCell}`}>
                        <Hint content={localize(i18n, 'trader.freeCostsInfo.marginHint')} />
                    </td>
                </tr>
                <tr className={row}>
                    <th className={headerCell}>
                        <span>{localize(i18n, 'trader.freeCostsInfo.creditFacilities')}</span>
                        <Hint
                            className={inlineRight}
                            content={localize(i18n, 'trader.freeCostsInfo.creditFacilitiesHint')}
                        />
                    </th>
                    <th className={headerCell} />
                    {hasOvernightReport && (
                        <th className={headerCell}>
                            {hasMarginReport && (
                                <span>{localize(i18n, 'trader.freeCostsInfo.overnightStatement')} </span>
                            )}
                            {hasMarginReport && (
                                <Hint
                                    className={inlineRight}
                                    content={localize(i18n, 'trader.freeCostsInfo.overnightStatementHint')}
                                />
                            )}
                        </th>
                    )}
                    {hasMarginReport && (
                        <th className={headerCell}>
                            {hasOvernightReport && (
                                <span>{localize(i18n, 'trader.freeCostsInfo.intradayStatement')} </span>
                            )}
                            {hasOvernightReport && (
                                <Hint
                                    className={inlineRight}
                                    content={localize(i18n, 'trader.freeCostsInfo.intradayStatementHint')}
                                />
                            )}
                        </th>
                    )}
                    <th className={headerCell} />
                </tr>
                <tr className={row}>
                    <td className={cell}>{localize(i18n, 'trader.freeCostsInfo.collateral')}</td>
                    {baseCurrencyCell}
                    {hasOvernightReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportEodTotalLongVal}
                                field="reportEodTotalLongVal"
                            />
                        </td>
                    )}
                    {hasMarginReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportTotalLongVal}
                                field="reportTotalLongVal"
                            />
                        </td>
                    )}
                    <td className={`${cell} ${centerContentCell}`}>
                        <Hint content={localize(i18n, 'trader.freeCostsInfo.collateralHint')} />
                    </td>
                </tr>
                <tr className={row}>
                    <td className={cell}>{localize(i18n, 'trader.freeCostsInfo.cashValue')}</td>
                    {baseCurrencyCell}
                    {hasOvernightReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportEodCashBal}
                                field="reportEodCashBal"
                            />
                        </td>
                    )}
                    {hasMarginReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount id={valueSourceId} value={totalPortfolio.reportCashBal} field="reportCashBal" />
                        </td>
                    )}
                    <td className={`${cell} ${centerContentCell}`}>
                        <Hint content={localize(i18n, 'trader.freeCostsInfo.cashValueHint')} />
                    </td>
                </tr>
                <tr className={row}>
                    <td className={cell}>{localize(i18n, 'trader.freeCostsInfo.deficit')}</td>
                    {baseCurrencyCell}
                    {hasOvernightReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount
                                id={valueSourceId}
                                value={totalPortfolio.reportEodDeficit}
                                field="reportEodDeficit"
                            />
                        </td>
                    )}
                    {hasMarginReport && (
                        <td className={`${cell} ${inlineEndContentCell}`}>
                            <Amount id={valueSourceId} value={totalPortfolio.reportDeficit} field="reportDeficit" />
                        </td>
                    )}
                    <td className={`${cell} ${centerContentCell}`}>
                        <Hint content={localize(i18n, 'trader.freeCostsInfo.deficitHint')} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default React.memo(FreeCostsInfo);
