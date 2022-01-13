import { produce } from 'immer';
import {
  DERI_RISK_INDICATOR_FETCH_CONTENT,
  DERI_RISK_INDICATOR_GOT_CONTENT,
  DERI_RISK_INDICATOR_SET_ACTIVE_CHART_SIN,
  DERI_RISK_INDICATOR_SET_ACTIVE_CHART_TIMESPAN,
} from './actions';
import { TIMESPAN_5Y } from '../../Chart/Chart.helper';


export const initialState = {
  isLoading: false,
  data: {
    activeChartTimespan: TIMESPAN_5Y,
  },
};

const deriRiskIndicatorReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case DERI_RISK_INDICATOR_FETCH_CONTENT:
      draft.isLoading = true;
      break;
    case DERI_RISK_INDICATOR_SET_ACTIVE_CHART_SIN:
      draft.data.activeChartTimespan = TIMESPAN_5Y;
      draft.data.activeChartSin = action.sin;
      break;
    case DERI_RISK_INDICATOR_GOT_CONTENT:
      if (action.response) {
        draft.data = { ...initialState.data, ...action.response };
      }
      draft.isLoading = false;
      break;
    case DERI_RISK_INDICATOR_SET_ACTIVE_CHART_TIMESPAN:
      if (action.timespan) {
        draft.data.activeChartTimespan = action.timespan;
      }
      break;
    default:
      break;
  }
});

export default deriRiskIndicatorReducer;
