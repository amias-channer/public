import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import getQuotecastRequestProductInfo from 'frontend-core/dist/services/quotecast/get-quotecast-request-product-info';
import {EventBroker} from '../../event-broker';
import {QuotecastEvents} from '../../event-broker/event-types';
import {QuotecastUpdate, QuotecastUpdateEvent} from '../../event-broker/resources/quotecast';
import {Unsubscribe} from '../../event-broker/subscription';
import {VwdChart, VwdChartSerie} from '../../models/vwd-api';
import {getDataPointsRange, unwrapConsole, wrapConsole} from './vwd-chart-api';

export default function subscribeOnChartRealTimeUpdates(
    chart: VwdChart,
    eventBroker: EventBroker,
    productInfo: ProductInfo
): Unsubscribe {
    let lastUpdatedPrice: number | undefined;
    let lastUpdatedDateTime: Date | undefined;
    let valuesUpdateTimerId: number | undefined;
    let valueUpdates: QuotecastUpdate['values'] | undefined;
    // [WF-1794]
    const lastPriceThreshold: number = 0.001;
    // milliseconds
    const lastDateTimeThreshold: number = 20_000;
    let onProductUpdate = (_event: QuotecastUpdateEvent, update: QuotecastUpdate) => {
        valueUpdates = {
            ...valueUpdates,
            ...update.values
        };

        const {LastPrice, LastDateTime} = valueUpdates;
        let serie: VwdChartSerie | undefined = chart.series[0];

        if (serie && LastPrice && LastDateTime) {
            const lastPrice: number = Number(LastPrice.value);

            // clear old values to save the relation between LastPrice & LastDateTime
            valueUpdates = undefined;
            const dataPoints = getDataPointsRange(chart);

            // [WF-1710] we should have a price threshold to prevent often updates
            if (lastUpdatedPrice != null && Math.abs(lastPrice - lastUpdatedPrice) < lastPriceThreshold) {
                return;
            }

            const lastDateTime: Date = new Date(LastDateTime.value as string);
            const lastDateTimeMs: number = lastDateTime.getTime();

            // [WF-1710] we should have a time threshold to prevent often updates
            if (lastUpdatedDateTime && lastDateTimeMs - lastUpdatedDateTime.getTime() < lastDateTimeThreshold) {
                return;
            }

            // [WF-1728], [WF-1710]
            if (!dataPoints || lastDateTime > new Date() || lastDateTimeMs <= dataPoints[1][0]) {
                return;
            }

            lastUpdatedPrice = lastPrice;
            lastUpdatedDateTime = lastDateTime;
            cancelAnimationFrame(valuesUpdateTimerId as number);
            valuesUpdateTimerId = undefined;

            valuesUpdateTimerId = requestAnimationFrame(() => {
                try {
                    serie?.updateValues({lastPrice, lastTime: lastDateTime});
                } catch (error: unknown) {
                    // catch the error from VWD API
                    logErrorLocally(error);
                }

                serie = undefined;
            });
        }
    };
    const onConsoleLogMessage = (message: unknown) => {
        if (typeof message === 'string' && message.includes('Highcharts error #15')) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            unsubscribe();
        }
    };
    let unsubscribeFromProductUpdates: Unsubscribe;
    const unsubscribe = () => {
        // already unsubscribed
        if (typeof unsubscribeFromProductUpdates !== 'function') {
            return;
        }

        unsubscribeFromProductUpdates();
        unwrapConsole(onConsoleLogMessage);
        // @ts-ignore
        onProductUpdate = undefined;
        // @ts-ignore
        unsubscribeFromProductUpdates = undefined;
        valueUpdates = undefined;
    };

    wrapConsole(onConsoleLogMessage);
    unsubscribeFromProductUpdates = eventBroker.on(
        QuotecastEvents.CHANGE,
        {
            products: [getQuotecastRequestProductInfo(productInfo)],
            fields: ['LastPrice', 'LastDateTime']
        },
        onProductUpdate
    );

    return unsubscribe;
}
