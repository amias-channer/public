import { pathOr } from 'ramda';
import { TIMESPAN_1D, TIMESPAN_1W } from '../../Chart/Chart.helper';
import { pathOrObject } from '../../../utils/typeChecker';

export const DEFAULT_CHART_URL_KEY = 'chartUrl';

export const MARKET_SENTIMENT_VALUE_SHORT = 'Short';
export const MARKET_SENTIMENT_VALUE_LONG = 'Long';
export const MARKET_SENTIMENT_VALUE_NEUTRAL = 'Neutral';

export const getSinValue = (data) => pathOr('', ['sin', 'value'])(data);
export const getNameShortValue = (data) => pathOr('', ['nameShort', 'value'])(data);
export const getTypeValue = (data) => pathOr('', ['type', 'value'])(data);
export const getMarketSentimentSmallValue = (data) => pathOr('', ['marketSentimentSmall', 'value'])(data);
export const getTimeFrameWidgetValue = (data) => pathOr('', ['timeFrameWidget', 'value'])(data);
export const getCurrentStateWidgetLabel = (data) => pathOr('', ['currentStateWidget', 'label'])(data);
export const getCurrentStateWidgetValue = (data) => pathOr('', ['currentStateWidget', 'value'])(data);
export const getUpdateWidgetLabel = (data) => pathOr('', ['updateWidget', 'label'])(data);
export const getUpdateWidgetValue = (data) => pathOr('', ['updateWidget', 'value'])(data);
export const getCmsAccordionComponentData = (data) => pathOrObject({ items: [] }, ['accordion', 0, 'data'], data);
export const getMarketSentimentSymbolByValue = (marketSentimentValue) => {
  switch (marketSentimentValue) {
    case MARKET_SENTIMENT_VALUE_SHORT:
      return 'arrow-down';
    case MARKET_SENTIMENT_VALUE_NEUTRAL:
      return 'rectangle';
    case MARKET_SENTIMENT_VALUE_LONG:
      return 'arrow-up';
    default:
      return 'arrow-up';
  }
};

export const getActiveChartTimespanKey = (timespan) => {
  switch (timespan) {
    case TIMESPAN_1D:
    case TIMESPAN_1W:
      return `${DEFAULT_CHART_URL_KEY}_${timespan}`;
    default:
      return DEFAULT_CHART_URL_KEY;
  }
};
