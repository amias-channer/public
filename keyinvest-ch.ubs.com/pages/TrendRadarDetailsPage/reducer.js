import { produce } from 'immer';
import {
  TREND_RADAR_DETAILS_PAGE_FETCH_CONTENT,
  TREND_RADAR_DETAILS_PAGE_GOT_BACKEND_ERROR,
  TREND_RADAR_DETAILS_PAGE_GOT_CONTENT,
  TREND_RADAR_DETAILS_PAGE_HIDE_LOGIN_REGISTER_MESSAGE,
  TREND_RADAR_DETAILS_PAGE_SHOW_LOGIN_REGISTER_MESSAGE,
  TREND_RADAR_DETAILS_PAGE_TOGGLE_DISPLAY_ALARM_POPUP,
  TREND_RADAR_DETAILS_PAGE_TOGGLE_SAVE_SIGNAL_POPUP,
} from './actions';

export const INITIAL_STATE = {
  alertPopup: {
    shouldDisplay: false,
    isLoading: false,
  },
  isBackendError: null,
  showLoginRegisterMessageBox: false,
  saveSignalPopup: {
    shouldDisplay: false,
  },
};

const trendRadarDetailsPageReducer = (state = INITIAL_STATE, action) => produce(state, (draft) => {
  switch (action.type) {
    case TREND_RADAR_DETAILS_PAGE_FETCH_CONTENT:
      draft.isLoading = true;
      break;
    case TREND_RADAR_DETAILS_PAGE_GOT_CONTENT:
      if (action.response && action.response.data) {
        draft.data = action.response.data;
      }
      draft.isLoading = false;
      break;
    case TREND_RADAR_DETAILS_PAGE_TOGGLE_DISPLAY_ALARM_POPUP:
      draft.alertPopup.shouldDisplay = action.shouldDisplayPopup;
      break;
    case TREND_RADAR_DETAILS_PAGE_GOT_BACKEND_ERROR:
      draft.isLoading = false;
      draft.alertPopup.isLoading = false;
      draft.isBackendError = action.error;
      break;
    case TREND_RADAR_DETAILS_PAGE_SHOW_LOGIN_REGISTER_MESSAGE:
      draft.showLoginRegisterMessageBox = true;
      break;
    case TREND_RADAR_DETAILS_PAGE_HIDE_LOGIN_REGISTER_MESSAGE:
      draft.showLoginRegisterMessageBox = false;
      break;
    case TREND_RADAR_DETAILS_PAGE_TOGGLE_SAVE_SIGNAL_POPUP:
      draft.saveSignalPopup.shouldDisplay = action.shouldDisplayPopup;
      break;
    default:
      break;
  }
});

export default trendRadarDetailsPageReducer;
