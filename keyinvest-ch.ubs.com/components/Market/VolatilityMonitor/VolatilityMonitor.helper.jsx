import { pathOr } from 'ramda';
import { TIMESPAN_1D, TIMESPAN_1W } from '../../Chart/Chart.helper';
import { DEFAULT_CHART_URL_KEY } from '../DeriRiskIndicator/DeriRiskIndicator.helper';

export const getVolatilityTileData = (item, data) => pathOr(false, ['widgetsData', item], data);
export const getVolatilityTileName = (item, data) => pathOr('', ['widgetsData', item, 'name', 'value'], data);
export const getVolatilityTileIsActive = (item, data) => pathOr(false, ['widgetsData', item, 'active'], data);
export const getVolatilityTileSin = (item, data) => pathOr(false, ['widgetsData', item, 'sin', 'value'], data);
export const getTrackingUrlOnTileClick = () => window.location.pathname;

export const getActiveChartTimespanKey = (timespan) => {
  switch (timespan) {
    case TIMESPAN_1D:
    case TIMESPAN_1W:
      return `${DEFAULT_CHART_URL_KEY}_${timespan}`;
    default:
      return DEFAULT_CHART_URL_KEY;
  }
};
