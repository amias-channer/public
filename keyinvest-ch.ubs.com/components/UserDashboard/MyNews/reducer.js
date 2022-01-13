import { produce } from 'immer';
import { MY_NEWS_FETCH_DATA, MY_NEWS_GOT_DATA, MY_NEWS_WILL_UNMOUNT } from './actions';

export const initialState = {
  data: {},
};

const myNewsReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case MY_NEWS_FETCH_DATA:
      draft.isLoading = true;
      break;
    case MY_NEWS_GOT_DATA:
      draft.data = action.data;
      draft.isLoading = false;
      break;
    case MY_NEWS_WILL_UNMOUNT:
      return initialState;
    default:
      break;
  }
});

export default myNewsReducer;
