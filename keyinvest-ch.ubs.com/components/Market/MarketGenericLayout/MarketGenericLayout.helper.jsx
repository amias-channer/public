import { TIMESPAN_1D, TIMESPAN_1W } from '../../Chart/Chart.helper';
import {
  INSTRUMENT_IDENTIFIER_SIN,
} from '../../../utils/globals';

const DEFAULT_CHART_URL_KEY = 'chartUrl';

export const MARKET_INSTRUMENT_IDENTIFIER = INSTRUMENT_IDENTIFIER_SIN;

export const getActiveChartTimespanKey = (timespan) => {
  switch (timespan) {
    case TIMESPAN_1D:
    case TIMESPAN_1W:
      return `${DEFAULT_CHART_URL_KEY}_${timespan}`;
    default:
      return DEFAULT_CHART_URL_KEY;
  }
};
