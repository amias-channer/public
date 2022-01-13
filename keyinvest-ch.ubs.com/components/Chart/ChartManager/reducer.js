import { produce } from 'immer';
import {
  CHART_MANAGER_DESTROY_INSTANCE,
  CHART_MANAGER_INSTANCE_READY,
  CHART_MANAGER_SET_CURRENT_TIMESPAN,
} from './actions';

export const initialState = {};
const chartManagerReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case CHART_MANAGER_INSTANCE_READY:
      if (!draft[action.uniqId]) {
        draft[action.uniqId] = {};
      }
      draft[action.uniqId].isReady = action.status;
      break;
    case CHART_MANAGER_SET_CURRENT_TIMESPAN:
      if (!draft[action.uniqId]) {
        draft[action.uniqId] = {};
      }
      draft[action.uniqId].currentTimespan = action.currentTimespan;
      break;
    case CHART_MANAGER_DESTROY_INSTANCE:
      if (draft[action.uniqId]) {
        delete draft[action.uniqId];
      }
      break;
    default:
      break;
  }
});

export default chartManagerReducer;
