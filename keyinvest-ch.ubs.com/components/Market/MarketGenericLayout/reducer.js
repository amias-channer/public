import { produce } from 'immer';
import {
  MARKET_GENERIC_FETCH_CONTENT,
  MARKET_GENERIC_FETCH_SORTED_TABLE_DATA,
  MARKET_GENERIC_GOT_CONTENT,
  MARKET_GENERIC_GOT_SORTED_TABLE_DATA,
  MARKET_GENERIC_SET_ACTIVE_CHART_TIME_SPAN,
  MARKET_GENERIC_SET_ACTIVE_GROUP,
  MARKET_GENERIC_WILL_UNMOUNT,
} from './actions';
import { MARKET_INSTRUMENT_IDENTIFIER } from './MarketGenericLayout.helper';
import { TIMESPAN_5Y } from '../../Chart/Chart.helper';

export const initialState = {
  tiles: null,
  activeInstrument: {
    [MARKET_INSTRUMENT_IDENTIFIER]: '',
    name: '',
  },
  chart: null,
  isLoading: false,
  chartTimeSpan: TIMESPAN_5Y,
};
const marketGenericReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case MARKET_GENERIC_FETCH_CONTENT:
      draft.isLoading = true;
      break;
    case MARKET_GENERIC_GOT_CONTENT:
      if (action.data) {
        if (action.data.chartUrl) {
          draft.chartUrl = action.data.chartUrl;
        }

        if (action.data.chartUrl_1D) {
          draft.chartUrl_1D = action.data.chartUrl_1D;
        }

        if (action.data.chartUrl_1W) {
          draft.chartUrl_1W = action.data.chartUrl_1W;
        }

        if (action.data.leverageProducts) {
          draft.leverageProducts = action.data.leverageProducts;
        }
        if (action.data.tiles) {
          draft.tiles = action.data.tiles;
          if (!draft.activeInstrument || !draft.activeInstrument[MARKET_INSTRUMENT_IDENTIFIER]) {
            draft.activeInstrument = {
              [MARKET_INSTRUMENT_IDENTIFIER]: action.data.tiles[0][MARKET_INSTRUMENT_IDENTIFIER],
              name: action.data.tiles[0].name,
            };
          }
        }

        if (action.data.activeGroup) {
          draft.activeGroup = action.data.activeGroup;
        }

        if (action.instrument) {
          draft.activeInstrument = {
            [MARKET_INSTRUMENT_IDENTIFIER]: action.instrument[MARKET_INSTRUMENT_IDENTIFIER],
            name: action.instrument.name,
          };
        }

        if (action.data.columnsToRender && action.data.rows) {
          draft.columnsToRender = action.data.columnsToRender;
          draft.rows = action.data.rows;
        }

        if (action.data.tableTitle) {
          draft.tableTitle = action.data.tableTitle;
        }
      }
      draft.isLoading = false;
      break;
    case MARKET_GENERIC_SET_ACTIVE_GROUP:
      if (action.group) {
        draft.activeGroup = action.group;
      }
      break;
    case MARKET_GENERIC_WILL_UNMOUNT:
      return initialState;

    case MARKET_GENERIC_FETCH_SORTED_TABLE_DATA:
      draft.tableIsLoading = true;
      break;
    case MARKET_GENERIC_GOT_SORTED_TABLE_DATA:
      if (action.data && action.data.columnsToRender && action.data.rows) {
        draft.columnsToRender = action.data.columnsToRender;
        draft.rows = action.data.rows;
      }
      draft.tableIsLoading = false;
      break;
    case MARKET_GENERIC_SET_ACTIVE_CHART_TIME_SPAN:
      if (action.timespan) {
        draft.chartTimeSpan = action.timespan;
      }
      break;
    default:
      break;
  }
});

export default marketGenericReducer;
