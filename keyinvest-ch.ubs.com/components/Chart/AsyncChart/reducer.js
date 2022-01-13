import { produce } from 'immer';
import {
  ASYNC_CHART_FETCH_CONTENT,
  ASYNC_CHART_GOT_CONTENT,
  ASYNC_CHART_WILL_UNMOUNT,
} from './actions';

export const initialState = {};
const asyncChartReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case ASYNC_CHART_FETCH_CONTENT:
      draft[action.uniqKey] = {
        isLoading: true,
      };
      break;
    case ASYNC_CHART_GOT_CONTENT:
      if (draft[action.uniqKey]) {
        if (action.data) {
          draft[action.uniqKey].data = action.data;
        }
        draft[action.uniqKey].isLoading = false;
      }
      break;
    case ASYNC_CHART_WILL_UNMOUNT:
      if (draft[action.uniqKey]) {
        delete draft[action.uniqKey];
      }
      break;
    default:
      break;
  }
});

export default asyncChartReducer;
