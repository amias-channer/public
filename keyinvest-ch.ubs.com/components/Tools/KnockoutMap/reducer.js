import { produce } from 'immer';
import {
  KNOCK_OUT_MAP_FETCH_DATA,
  KNOCK_OUT_MAP_GOT_DATA, KNOCK_OUT_MAP_WILL_UNMOUNT,
} from './actions';


export const initialState = {};

const knockoutMapReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case KNOCK_OUT_MAP_FETCH_DATA:
      draft.isLoading = true;
      break;
    case KNOCK_OUT_MAP_GOT_DATA:
      draft.data = action.data;
      draft.isLoading = false;
      break;
    case KNOCK_OUT_MAP_WILL_UNMOUNT:
      if (draft.data) {
        delete draft.data;
        delete draft.isLoading;
      }
      break;
    default:
      break;
  }
});

export default knockoutMapReducer;
