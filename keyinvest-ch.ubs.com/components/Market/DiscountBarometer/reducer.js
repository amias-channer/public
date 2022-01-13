import { produce } from 'immer';
import {
  DISCOUNT_BAROMETER_FETCH_CONTENT,
  DISCOUNT_BAROMETER_GOT_CONTENT,
  DISCOUNT_BAROMETER_WILL_UNMOUNT,
} from './actions';

export const initialState = {
  isLoading: false,
  data: {
    'discount-barometer': {
      description: [],
    },
    charts: {},
  },
};
const discountBarometerReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case DISCOUNT_BAROMETER_FETCH_CONTENT:
      draft.isLoading = true;
      break;
    case DISCOUNT_BAROMETER_GOT_CONTENT:
      if (action.data) {
        draft.data = action.data;
      }
      draft.isLoading = false;
      break;
    case DISCOUNT_BAROMETER_WILL_UNMOUNT:
      return initialState;
    default:
      break;
  }
});

export default discountBarometerReducer;
