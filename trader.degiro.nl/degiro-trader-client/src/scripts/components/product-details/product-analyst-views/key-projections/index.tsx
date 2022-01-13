import getMonthName from 'frontend-core/dist/services/date/get-month-name';
import localize from 'frontend-core/dist/services/i18n/localize';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import * as React from 'react';
import {I18nContext} from '../../../app-component/app-context';
import {KeyFigures} from '../../../../models/analyst-views';
import KeyProjectionsItemRow from './key-projections-item-row';
import NoDataMessage from '../../no-data-message';
import {CompanyKeyProjections, RefinitivCompanyRatios} from '../../../../models/refinitiv-company-profile';
import areCompanyRatiosUpToDate from '../../../../services/product-analyst-views/are-company-ratios-up-to-date';
import TwoPointsChart from '../../../chart/two-points-chart';
import {
    layout,
    cell,
    chart,
    chartsContainer,
    chartsContainerCompactView,
    headerCell,
    leftChart,
    rightChart,
    row,
    table,
    tooltipButton,
    chartLabel,
    noDataMessage
} from './key-projections.css';
import Card from '../../../card';
import ProductDetailsHint from '../../product-details-hint';
import TooltipDescriptionLine from '../../product-details-hint/tooltip-description-line';
import {openedTooltip} from '../../product-ratios/ratios-table/ratios-table.css';
import keyProjectionsTooltips from '../../tooltips-data/refinitiv-key-projections-tooltips';
import Header from './header';
import hasSomeKeyFigures from '../has-some-key-figures';
import Disclaimer from '../../../disclaimer';
import {nbsp, valuesDelimiter} from '../../../value';
import DateValue from '../../../value/date';

interface Props {
    companyRatios?: RefinitivCompanyRatios;
    keyFigures: KeyFigures;
    isCompactView: boolean;
}

interface Item {
    label: string;
    last?: number;
    projected?: number;
    tooltipKey: keyof CompanyKeyProjections & string;
}

const {useContext, useMemo} = React;
const KeyProjections: React.FunctionComponent<Props> = ({companyRatios = {}, keyFigures, isCompactView}) => {
    const isPointerDevice = !isTouchDevice();
    const i18n = useContext(I18nContext);
    const {lastModified, currentRatios, forecastData} = companyRatios;
    const {currency} = currentRatios || {};
    const {consensusType, earningsBasis, endMonth, fiscalYear, interimEndCalMonth, interimEndCalYear} =
        forecastData || {};
    const items: Item[] = useMemo(
        () => [
            {
                label: localize(i18n, 'trader.productDetails.analystViews.keyProjections.priceToEarningsTTM'),
                last: keyFigures.PEINCLXOR,
                projected: keyFigures.ProjPE,
                tooltipKey: 'PEINCLXOR'
            },
            {
                label: localize(i18n, 'trader.productDetails.analystViews.keyProjections.priceToSalesLFY'),
                last: keyFigures.APR2REV,
                projected: keyFigures.Price2ProjSales,
                tooltipKey: 'APR2REV'
            },
            {
                label: localize(i18n, 'trader.productDetails.analystViews.keyProjections.salesPerSharesLFY'),
                last: keyFigures.AREVPS,
                projected: keyFigures.ProjSalesPS,
                tooltipKey: 'AREVPS'
            },
            {
                label: localize(i18n, 'trader.productDetails.analystViews.keyProjections.salesLFY'),
                last: keyFigures.AREV,
                projected: keyFigures.ProjSales,
                tooltipKey: 'AREV'
            },
            {
                label: localize(i18n, 'trader.productDetails.analystViews.keyProjections.quarterlySalesMRQ'),
                last: keyFigures.SREV,
                projected: keyFigures.ProjSalesQ,
                tooltipKey: 'SREV'
            },
            {
                label: localize(i18n, 'trader.productDetails.analystViews.keyProjections.earningsPerShareTTM'),
                last: keyFigures.TTMEPSINCX,
                projected: keyFigures.ProjEPS,
                tooltipKey: 'TTMEPSINCX'
            },
            {
                label: localize(i18n, 'trader.productDetails.analystViews.keyProjections.quarterlyEarningsPerShareMRQ'),
                last: keyFigures.EPSActualQ,
                projected: keyFigures.ProjEPSQ,
                tooltipKey: 'EPSActualQ'
            },
            {
                label: localize(i18n, 'trader.productDetails.analystViews.keyProjections.dividendPerShareLFY'),
                last: keyFigures.ADIVSHR,
                projected: keyFigures.ProjDPS,
                tooltipKey: 'ADIVSHR'
            }
        ],
        [i18n, keyFigures]
    );
    const hasData = areCompanyRatiosUpToDate(companyRatios) && hasSomeKeyFigures(keyFigures);
    const disclaimerTextContent: string[] = useMemo(
        () => [
            localize(i18n, 'trader.productDetails.analystViews.estimations.currency', {
                currency
            }),
            localize(i18n, 'trader.productDetails.analystViews.keyProjections.consensusType', {
                consensusType
            }),
            localize(i18n, 'trader.productDetails.analystViews.keyProjections.earningsBasis', {
                earningsBasis
            }),
            localize(i18n, 'trader.productDetails.analystViews.keyProjections.currentLfyTtm', {
                monthName: getMonthName(i18n, Number(endMonth)),
                year: fiscalYear
            }),
            localize(i18n, 'trader.productDetails.analystViews.keyProjections.currentMrq', {
                monthName: getMonthName(i18n, Number(interimEndCalMonth)),
                year: interimEndCalYear
            })
        ],
        [i18n, endMonth, fiscalYear, interimEndCalMonth, interimEndCalYear, currency, consensusType, earningsBasis]
    );

    return (
        <div className={layout}>
            <Card
                data-name="keyProjections"
                header={<Header hasTooltips={hasData} />}
                innerHorizontalGap={false}
                footer={
                    hasData ? (
                        <Disclaimer>
                            *{nbsp}
                            {localize(i18n, 'trader.productDetails.analystViews.estimations.lastUpdated')}:{nbsp}
                            <DateValue id="lastUpdated" field="lastUpdated" value={lastModified} />
                            {valuesDelimiter}
                            {disclaimerTextContent.join(valuesDelimiter)}
                        </Disclaimer>
                    ) : (
                        true
                    )
                }>
                {hasData ? (
                    <>
                        <div className={`${chartsContainer} ${isCompactView ? chartsContainerCompactView : ''}`}>
                            <TwoPointsChart
                                chartLabel={
                                    <>
                                        {localize(i18n, 'trader.productDetails.analystViews.keyProjections.price')}
                                        {isPointerDevice && (
                                            <ProductDetailsHint
                                                className={tooltipButton}
                                                activeClassName={openedTooltip}
                                                tooltip={<TooltipDescriptionLine {...keyProjectionsTooltips.Price} />}
                                            />
                                        )}
                                    </>
                                }
                                className={`${chart} ${isCompactView ? '' : leftChart}`}
                                chartLabelClassName={chartLabel}
                                leftFigureValue={keyFigures.NPRICE}
                                rightFigureValue={keyFigures.TargetPrice}
                                leftFigureLabel={localize(
                                    i18n,
                                    'trader.productDetails.analystViews.keyProjections.lastClose'
                                )}
                                rightFigureLabel={localize(
                                    i18n,
                                    'trader.productDetails.analystViews.keyProjections.targetProjectedPrice'
                                )}
                            />
                            <TwoPointsChart
                                chartLabel={
                                    <>
                                        {localize(
                                            i18n,
                                            'trader.productDetails.analystViews.keyProjections.longTermGrowthRate'
                                        )}
                                        {isPointerDevice && (
                                            <ProductDetailsHint
                                                className={tooltipButton}
                                                activeClassName={openedTooltip}
                                                tooltip={
                                                    <TooltipDescriptionLine
                                                        {...keyProjectionsTooltips.LongTermGrowthRate}
                                                    />
                                                }
                                            />
                                        )}
                                    </>
                                }
                                className={`${chart} ${isCompactView ? '' : rightChart}`}
                                chartLabelClassName={chartLabel}
                                leftFigureValue={keyFigures.REVGRPCT}
                                rightFigureValue={keyFigures.ProjLTGrowthRate}
                                leftFigureLabel={localize(
                                    i18n,
                                    'trader.productDetails.analystViews.keyProjections.lastThreeYearCAGR'
                                )}
                                rightFigureLabel={localize(
                                    i18n,
                                    'trader.productDetails.analystViews.keyProjections.projected'
                                )}
                            />
                        </div>
                        <table className={table}>
                            <thead>
                                <tr className={row}>
                                    <th className={`${cell} ${headerCell}`} />
                                    <th className={`${cell} ${headerCell}`}>
                                        {localize(i18n, 'trader.productDetails.analystViews.keyProjections.last')}
                                    </th>
                                    <th className={`${cell} ${headerCell}`}>
                                        {localize(i18n, 'trader.productDetails.analystViews.keyProjections.projected')}
                                    </th>
                                    <th className={`${cell} ${headerCell}`}>
                                        {localize(i18n, 'trader.productDetails.analystViews.keyProjections.graph')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(({label, last, projected, tooltipKey}: Item) => (
                                    <KeyProjectionsItemRow
                                        key={label}
                                        isCompactView={isCompactView}
                                        label={
                                            <>
                                                {label}
                                                {isPointerDevice && (
                                                    <ProductDetailsHint
                                                        className={tooltipButton}
                                                        activeClassName={openedTooltip}
                                                        tooltip={
                                                            <TooltipDescriptionLine
                                                                key={last}
                                                                {...keyProjectionsTooltips[tooltipKey]}
                                                            />
                                                        }
                                                    />
                                                )}
                                            </>
                                        }
                                        last={last}
                                        projected={projected}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <NoDataMessage hasCompactLayout={isCompactView} className={noDataMessage} />
                )}
            </Card>
        </div>
    );
};

export default React.memo(KeyProjections);
