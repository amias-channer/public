import { produce } from 'immer';
import {
  MARKET_MEMBERS_FETCH_CONTENT,
  MARKET_MEMBERS_GOT_CONTENT,
  MARKET_MEMBERS_WILL_UNMOUNT,
} from './actions';

export const initialState = {
  isLoading: false,
  data: {},
};
const marketMembersReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case MARKET_MEMBERS_FETCH_CONTENT:
      draft.isLoading = true;
      break;
    case MARKET_MEMBERS_GOT_CONTENT:
      if (action.data) {
        draft.data = action.data;
      }
      draft.isLoading = false;
      break;
    case MARKET_MEMBERS_WILL_UNMOUNT:
      return initialState;
    default:
      break;
  }
});

export default marketMembersReducer;
