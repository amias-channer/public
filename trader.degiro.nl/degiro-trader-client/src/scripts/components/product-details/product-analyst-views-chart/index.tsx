import localize from 'frontend-core/dist/services/i18n/localize';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import formatNumber from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import {BarChartPoint} from '../../../models/chart';
import {ChartLabelFormatter} from '../../chart/bar-chart/bar-chart-y-axis';
import {grid, heatMapPalette} from '../../chart/constants';
import {ConfigContext, I18nContext} from '../../app-component/app-context';
import {RefinitivCompanyRatios} from '../../../models/refinitiv-company-profile';
import AnalystRating from './analyst-rating/index';
import BarChartStacked from '../../chart/bar-chart/bar-chart-stacked';
import ChartLegend, {LegendItem} from '../chart-legend';
import getAnalystViews from '../../../services/refinitiv-company-ratios/get-analyst-views';
import getCurrentAnalystRating from '../../../services/refinitiv-company-ratios/get-current-analyst-rating';
import NoDataMessage from '../no-data-message';
import {layoutWithData, largeLayout, chartLegend, layoutWithoutData} from './product-analyst-views-chart.css';
import {noDataToDisplay} from '../no-data-message/no-data-message.css';
import TableShadowedWrapper from '../../table/table-shadowed-wrapper';

const {useMemo, useCallback, useContext} = React;

export enum ChartSizes {
    LARGE = 'LARGE',
    SMALL = 'SMALL'
}

interface Props {
    companyRatios?: RefinitivCompanyRatios;
    size?: ChartSizes;
    isCompactView?: boolean;
}

const ProductAnalystViewsChart: React.FunctionComponent<Props> = ({
    companyRatios,
    size = ChartSizes.SMALL,
    isCompactView = false
}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const analystViews = useMemo<BarChartPoint[]>(() => (companyRatios ? getAnalystViews(companyRatios) : []), [
        companyRatios
    ]);
    const currentAnalystRating = useMemo<number | undefined>(
        () => companyRatios && getCurrentAnalystRating(companyRatios),
        [companyRatios]
    );
    const legendItems: LegendItem[] = useMemo(
        () => [
            {name: localize(i18n, 'trader.productDetails.analystViews.buy'), color: heatMapPalette[4]},
            {name: localize(i18n, 'trader.productDetails.analystViews.outperform'), color: heatMapPalette[3]},
            {name: localize(i18n, 'trader.productDetails.analystViews.hold'), color: heatMapPalette[2]},
            {name: localize(i18n, 'trader.productDetails.analystViews.underperform'), color: heatMapPalette[1]},
            {name: localize(i18n, 'trader.productDetails.analystViews.sell'), color: heatMapPalette[0]}
        ],
        [i18n]
    );
    const labelFormatter = useCallback<ChartLabelFormatter>(
        (value) =>
            formatNumber(value, {
                fractionDelimiter: config.fractionDelimiter,
                thousandDelimiter: config.thousandDelimiter,
                fractionSize: 1
            }),
        [config]
    );
    const hasAnalystViewData: boolean = isNonEmptyArray(analystViews);
    const content: React.ReactElement = (
        <div
            className={`
                ${hasAnalystViewData ? layoutWithData : layoutWithoutData}
                ${size === ChartSizes.LARGE ? largeLayout : ''}
            `}>
            {hasAnalystViewData ? (
                <>
                    <BarChartStacked
                        chartData={analystViews}
                        labelFormatter={labelFormatter}
                        colors={heatMapPalette}
                        height={(size === ChartSizes.LARGE ? 64 : 44) * grid}
                    />
                    <ChartLegend legend={legendItems} className={chartLegend} />
                    {currentAnalystRating && (
                        <AnalystRating value={currentAnalystRating} hasFullView={size === ChartSizes.LARGE} />
                    )}
                </>
            ) : (
                <NoDataMessage hasCompactLayout={isCompactView} className={noDataToDisplay} />
            )}
        </div>
    );

    return size === ChartSizes.LARGE ? content : <TableShadowedWrapper>{() => content}</TableShadowedWrapper>;
};

export default React.memo(ProductAnalystViewsChart);
