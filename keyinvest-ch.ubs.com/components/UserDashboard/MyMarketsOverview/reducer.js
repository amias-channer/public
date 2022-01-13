import { produce } from 'immer';
import { TIMESPAN_5Y } from '../../Chart/Chart.helper';
import {
  MY_MARKETS_DELETE_UNDERLYING,
  MY_MARKETS_FETCH_UNDERLYINGS_LIST,
  MY_MARKETS_GET_SEARCH_RESULTS,
  MY_MARKETS_GOT_DELETE_UNDERLYING,
  MY_MARKETS_GOT_PUT_UNDERLYING,
  MY_MARKETS_GOT_SEARCH_RESULTS,
  MY_MARKETS_GOT_UNDERLYINGS_LIST,
  MY_MARKETS_LIST_RESET_FLYOUT_SEARCH_BOX_DATA,
  MY_MARKETS_PUT_UNDERLYING,
  MY_MARKETS_SET_ACTIVE_CHART_TIME_SPAN,
  MY_MARKETS_SET_ACTIVE_UNDERLYING,
  MY_MARKETS_SET_DISPLAY_SEARCHBOX_FLYOUT,
  MY_MARKETS_WILL_UNMOUNT,
} from './actions';

export const initialState = {
  tiles: null,
  activeInstrument: {
  },
  isLoading: false,
  failure: null,
  activeTimespan: TIMESPAN_5Y,
  flyoutSearchBox: {
    shouldDisplay: false,
  },
};
const myMarketReducer = (state = initialState, action = {}) => produce(state, (draft) => {
  switch (action.type) {
    case MY_MARKETS_FETCH_UNDERLYINGS_LIST:
      draft.isLoading = true;
      break;
    case MY_MARKETS_GOT_UNDERLYINGS_LIST:
      if (action.data) {
        if (action.data.underlyings) {
          draft.underlyings = action.data.underlyings;
          // eslint-disable-next-line max-len
          draft.activeInstrument = action.data.underlyings.length ? action.data.underlyings[0] : null;
        }
        draft.count = action.data.count;
        draft.limit = action.data.limit;
        draft.urlAddUnderlying = action.data.urlAddUnderlying;
      }
      draft.isLoading = false;
      break;

    case MY_MARKETS_GET_SEARCH_RESULTS:
      draft.isSearchLoading = true;
      break;
    case MY_MARKETS_SET_DISPLAY_SEARCHBOX_FLYOUT:
      draft.flyoutSearchBox.shouldDisplay = action.status;
      break;
    case MY_MARKETS_LIST_RESET_FLYOUT_SEARCH_BOX_DATA:
      draft.searchData = {};
      break;

    case MY_MARKETS_GOT_SEARCH_RESULTS:
      draft.searchData = action.data;
      draft.isSearchLoading = false;
      break;
    case MY_MARKETS_SET_ACTIVE_UNDERLYING:
      if (action.underlyingData) {
        draft.activeInstrument = action.underlyingData;
      }
      break;
    case MY_MARKETS_SET_ACTIVE_CHART_TIME_SPAN:
      if (action.timespan) {
        draft.activeTimespan = action.timespan;
      }
      break;
    case MY_MARKETS_PUT_UNDERLYING:
      draft.isLoading = true;
      break;
    case MY_MARKETS_GOT_PUT_UNDERLYING:
    case MY_MARKETS_GOT_DELETE_UNDERLYING:
      draft.isLoading = false;
      if (action.failure) {
        draft.failure = action.failure;
      } else {
        draft.failure = null;
      }
      break;
    case MY_MARKETS_DELETE_UNDERLYING:
      draft.isLoading = true;
      break;
    case MY_MARKETS_WILL_UNMOUNT:
      return initialState;
    default:
      break;
  }
});

export default myMarketReducer;
