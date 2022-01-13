import { produce } from 'immer';
import {
  VOLATILITY_MONITOR_FETCH_CONTENT,
  VOLATILITY_MONITOR_GOT_CONTENT,
  VOLATILITY_MONITOR_SET_ACTIVE_CHART_SIN,
  VOLATILITY_MONITOR_SET_ACTIVE_CHART_TIMESPAN,
  VOLATILITY_MONITOR_WILL_UNMOUNT,
} from './actions';
import { TIMESPAN_5Y } from '../../Chart/Chart.helper';


export const initialState = {
  isLoading: false,
  data: {
    activeChartTimespan: TIMESPAN_5Y,
  },
};
const volatilityMonitorReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case VOLATILITY_MONITOR_FETCH_CONTENT:
      draft.isLoading = true;
      break;
    case VOLATILITY_MONITOR_GOT_CONTENT:
      if (action.response) {
        draft.data = { ...initialState.data, ...action.response };
      }
      draft.isLoading = false;
      break;
    case VOLATILITY_MONITOR_SET_ACTIVE_CHART_SIN:
      if (draft.data && draft.data.widgetsData && draft.data.activeChartSin && action.sin) {
        draft.data.activeChartTimespan = initialState.data.activeChartTimespan;
        draft.data.widgetsData[draft.data.activeChartSin].active = false;
        draft.data.activeChartSin = action.sin;
        draft.data.widgetsData[action.sin].active = true;
      }
      break;
    case VOLATILITY_MONITOR_SET_ACTIVE_CHART_TIMESPAN:
      if (action.timespan) {
        draft.data.activeChartTimespan = action.timespan;
      }
      break;
    case VOLATILITY_MONITOR_WILL_UNMOUNT:
      draft.data = {};
      draft.isLoading = initialState.isLoading;
      break;
    default:
      break;
  }
});

export default volatilityMonitorReducer;
