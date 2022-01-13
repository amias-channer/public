import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select/index';
import useAsync from 'frontend-core/dist/hooks/use-async';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {OrderTypeIds} from 'frontend-core/dist/models/order';
import {ProductInfo} from 'frontend-core/dist/models/product';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {CommonOrderEvents} from '../../event-broker/event-types';
import {Unsubscribe} from '../../event-broker/subscription';
import {smallViewportMinWidth as fullLayoutMediaQuery} from '../../media-queries/index';
import {VwdChartTimeResolutionValue} from '../../models/product-chart';
import {
    VwdApiEvent,
    VwdChart,
    VwdChartPeriodValue,
    VwdChartPoint,
    VwdChartType,
    VwdChartTypes
} from '../../models/vwd-api';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    EventBrokerContext,
    I18nContext,
    MainClientContext
} from '../app-component/app-context';
import GroupSelect from '../group-select/index';
import Chart from './chart';
import ChartSettings, {ChartSettingsModel} from './chart-settings/index';
import getChartSeriesFromProductInfo, {Series, SeriesStyle} from './get-chart-series-from-product-info';
import getChartTypeSelectOptions from './get-chart-type-select-options';
import getComparableProductsOptions, {ComparableProductsOption} from './get-comparable-products-options';
import getExternalChartUrl from './get-external-chart-url';
import getPeriodSelectOptions from './get-period-select-options';
import getTimeResolutionValues from './get-time-resolution-values';
import isStreamingEnabled from './is-streaming-enabled';
import {chartPeriodFilterLayout, chartPlaceholder, filters} from './product-chart.css';
import subscribeOnChartRealTimeUpdates from './subscribe-on-chart-real-time-updates';

export interface ProductChartProps {
    className?: string;
    productInfo: ProductInfo;
    tradeOnClick?: boolean;
    hasHiddenSettings?: boolean;
    hasHiddenDetailsLink?: boolean;
    wrapperClassName?: string;
    chartPeriodsItemClassName?: string;
    chartPeriodFilterLayoutClass?: string;
}

export interface VwdChartUpdateOptions {
    period?: VwdChartPeriodValue;
    resolution?: VwdChartTimeResolutionValue;
    start?: string;
    end?: string;
    streaming?: boolean;
}

const {useState, useEffect, useRef, useMemo, useCallback, useContext} = React;
const getPrimaryStyle = (chartType: VwdChartType): SeriesStyle => ({
    color: '#CC4C3B', // CSS --negative-value-color
    upColor: '#008753', // CSS --positive-value-color
    downColor: '#CC4C3B', // CSS --negative-value-color
    lineWidth: chartType === VwdChartTypes.CANDLESTICK ? 0 : 1.5
});
const getSecondaryStyle = (_chartType: VwdChartType): SeriesStyle => ({
    color: '#121212' // CSS --ink900-color
});
const ProductChart: React.FunctionComponent<ProductChartProps> = ({
    productInfo,
    tradeOnClick = !isTouchDevice(),
    className = '',
    wrapperClassName = '',
    chartPeriodFilterLayoutClass = '',
    chartPeriodsItemClassName,
    hasHiddenSettings,
    hasHiddenDetailsLink
}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const mainClient = useContext(MainClientContext);
    const currentClient = useContext(CurrentClientContext);
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const defaultChartType: VwdChartType = VwdChartTypes.AREA;
    const defaultPeriod: VwdChartPeriodValue = 'P1D';
    const unsubscribeFromChartRealTimeUpdates = useRef<undefined | Unsubscribe>();
    const chartTypeSelectOptions: SelectOption[] = useMemo(() => getChartTypeSelectOptions(i18n), [i18n]);
    const periodSelectOptions: SelectOption[] = useMemo(() => getPeriodSelectOptions(i18n), [i18n]);
    const [comparableProduct, setComparableProduct] = useState<ProductInfo | undefined>();
    const [chartType, setChartType] = useState<VwdChartTypes>(defaultChartType);
    const [options, setOptions] = useState<VwdChartUpdateOptions>(() => ({
        period: defaultPeriod,
        resolution: getTimeResolutionValues(defaultPeriod, defaultChartType)[0]
    }));
    const hasFullLayout: boolean = useMediaQuery(fullLayoutMediaQuery);
    const {value: comparableProductsOptions = []} = useAsync<ComparableProductsOption[]>(
        () => getComparableProductsOptions(config, currentClient, i18n),
        [config, currentClient, i18n]
    );
    const updateChartSubscription = useCallback(
        (chart: VwdChart, options: VwdChartUpdateOptions) => {
            unsubscribeFromChartRealTimeUpdates.current?.();
            unsubscribeFromChartRealTimeUpdates.current = isStreamingEnabled(options)
                ? subscribeOnChartRealTimeUpdates(chart, eventBroker, productInfo)
                : undefined;
        },
        [eventBroker, productInfo]
    );
    const onChartPointSelect = useCallback(
        (_event: VwdApiEvent, point: VwdChartPoint | undefined) => {
            if (point && tradeOnClick && productInfo.tradable) {
                eventBroker.emit(CommonOrderEvents.OPEN, {
                    productInfo,
                    isBuyAction: true,
                    orderTypeId: OrderTypeIds.LIMIT,
                    orderData: {limit: point.value}
                });
            }
        },
        [tradeOnClick, productInfo, eventBroker]
    );
    const onChartPeriodSelect = (chartType: VwdChartTypes, period: VwdChartPeriodValue) => {
        setOptions((options) => ({
            ...options,
            period,
            resolution: getTimeResolutionValues(period, chartType)[0]
        }));
    };
    const openChartSettings = () => {
        // remove current chart product from comparison options
        const productsOptions = comparableProductsOptions.filter(({value}) => {
            return typeof value === 'number' || String(value.id) !== String(productInfo.id);
        });
        const onSave = (settings: Readonly<ChartSettingsModel>) => {
            app.closeModal();
            setComparableProduct(settings.comparableProduct);
            setChartType(settings.chartType || defaultChartType);
            setOptions((options) => ({
                ...options,
                period: settings.period,
                resolution: settings.resolution
            }));
        };

        app.openModal({
            title: localize(i18n, 'trader.productChart.settings.title'),
            content: (
                <ChartSettings
                    values={{
                        comparableProduct,
                        period: options.period,
                        resolution: options.resolution,
                        chartType
                    }}
                    comparableProductsOptions={productsOptions}
                    chartTypeSelectOptions={chartTypeSelectOptions}
                    periodSelectOptions={periodSelectOptions}
                    // eslint-disable-next-line react/jsx-no-bind
                    onSave={onSave}
                />
            ),
            footer: null
        });
    };

    useEffect(() => {
        return () => {
            unsubscribeFromChartRealTimeUpdates.current?.();
            unsubscribeFromChartRealTimeUpdates.current = undefined;
        };
    }, []);

    const {period} = options;
    const chartUrl: string | undefined = getExternalChartUrl(config, mainClient, productInfo);
    const series: (Series | undefined)[] = comparableProduct
        ? [
              getChartSeriesFromProductInfo(productInfo, getPrimaryStyle(chartType)),
              getChartSeriesFromProductInfo(comparableProduct, getSecondaryStyle(chartType))
          ]
        : [getChartSeriesFromProductInfo(productInfo, getPrimaryStyle(chartType))];

    return (
        <div className={wrapperClassName}>
            <div className={`${chartPlaceholder} ${className}`}>
                <Chart
                    series={series}
                    key={chartType + productInfo.id}
                    chartType={chartType}
                    options={options}
                    onPointSelect={onChartPointSelect}
                    onOptionsChange={updateChartSubscription}
                />
            </div>
            <div className={filters}>
                <div className={`${chartPeriodFilterLayout} ${chartPeriodFilterLayoutClass}`}>
                    <GroupSelect
                        name="chartPeriod"
                        itemClassName={chartPeriodsItemClassName}
                        selectedOptionId={period}
                        onChange={onChartPeriodSelect.bind(null, chartType)}
                        options={periodSelectOptions.map(({value, label}: SelectOption) => ({
                            id: String(value),
                            label
                        }))}
                    />
                </div>
                {!hasHiddenSettings && (
                    <button type="button" data-name="settingsButton" onClick={openChartSettings}>
                        <Icon type="settings_outline" className={hasFullLayout ? inlineLeft : undefined} />
                        {hasFullLayout && localize(i18n, 'trader.productChart.settings.title')}
                    </button>
                )}
                {!hasHiddenDetailsLink && (
                    <NewTabLink href={chartUrl}>
                        <Icon type="interactive_graph" className={hasFullLayout ? inlineLeft : undefined} />
                        {hasFullLayout && localize(i18n, 'trader.productChart.moreDetailsLink')}
                    </NewTabLink>
                )}
            </div>
        </div>
    );
};

export default React.memo(ProductChart);
