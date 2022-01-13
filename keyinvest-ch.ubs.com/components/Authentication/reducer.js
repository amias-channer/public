import { produce } from 'immer';
import {
  AUTHENTICATION_SET_USER_LOGGED_IN,
  AUTHENTICATION_SET_USER_LOGGED_OUT,
  AUTHENTICATION_TOGGLE_AUTH_POPUP,
} from './actions';

export const defaultState = {
  showTopAuthPopup: false,
  isUserAuthenticated: false,
  userProfile: null,
};

const authenticationReducer = (state = defaultState, action) => produce(state, (draft) => {
  switch (action.type) {
    case AUTHENTICATION_TOGGLE_AUTH_POPUP:
      draft.showTopAuthPopup = action.showTopAuthPopup;
      break;
    case AUTHENTICATION_SET_USER_LOGGED_IN:
      draft.isUserAuthenticated = true;
      draft.userProfile = action.payload.userProfile;
      break;
    case AUTHENTICATION_SET_USER_LOGGED_OUT:
      draft.isUserAuthenticated = false;
      draft.userProfile = null;
      break;

    default:
      break;
  }
});

export default authenticationReducer;
