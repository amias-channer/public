import { produce } from 'immer';
import {
  assocPath, path, pathOr, remove,
} from 'ramda';
import {
  TREND_RADAR_ALARM_POPUP_SET_BACKEND_ERROR,
  TREND_RADAR_ALARM_POPUP_FETCH_ALERTS_DATA,
  TREND_RADAR_ALARM_POPUP_FORM_ALERT_DISMISS,
  TREND_RADAR_ALARM_POPUP_FORM_FIELD_CHANGE,
  TREND_RADAR_ALARM_POPUP_GOT_ALERTS_DATA,
  TREND_RADAR_ALARM_POPUP_SET_ALERT_METHOD,
  TREND_RADAR_ALARM_POPUP_SET_FORM_ERRORS,
  TREND_RADAR_ALARM_POPUP_SUBMIT_FORM,
  TREND_RADAR_ALARM_POPUP_FORM_SUBMIT_SUCCESS,
  TREND_RADAR_ALARM_POPUP_FORM_VALIDATION_ERROR_DISMISS,
  TREND_RADAR_ALARM_POPUP_FORM_DID_UNMOUNT,
} from './actions';
import {
  FORM_FIELD_CHECKBOX,
  FORM_FIELD_CHECKBOX_LIST, FORM_FIELD_ICON_INPUT_TEXT,
  FORM_FIELD_INPUT_TEXT, FORM_FIELD_SEARCHABLE_CHECKBOX_DROPDOWN_LIST,
} from './CreateAlertForm/CreateAlertForm.helper';

const INITIAL_STATE = {
  backendError: null,
  formValidationErrors: [],
  success: null,
  isLoading: false,
};
const trendRadarAlarmPopupReducer = (state = INITIAL_STATE, action) => produce(state, (draft) => {
  switch (action.type) {
    case TREND_RADAR_ALARM_POPUP_FETCH_ALERTS_DATA:
      draft.isLoading = true;
      break;
    case TREND_RADAR_ALARM_POPUP_GOT_ALERTS_DATA:
      draft.data = action.response.data;
      draft.isLoading = false;
      draft.backendError = null;
      break;
    case TREND_RADAR_ALARM_POPUP_SET_ALERT_METHOD:
      draft.selectedAlertMethod = action.method;
      draft.backendError = null;
      draft.success = null;
      draft.isLoading = false;
      break;
    case TREND_RADAR_ALARM_POPUP_FORM_FIELD_CHANGE:
      switch (action.fieldType) {
        case FORM_FIELD_SEARCHABLE_CHECKBOX_DROPDOWN_LIST: {
          const isChecked = path(['checked'], action.currentTarget);
          const listItemIndex = path(['value'], action.currentTarget);
          return assocPath([...action.stateDataSource, 'fieldValue', listItemIndex, 'checked'], isChecked, draft);
        }
        case FORM_FIELD_CHECKBOX_LIST: {
          const isChecked = path(['checked'], action.currentTarget);
          return assocPath([...action.stateDataSource, 'fieldValue', action.listItemIndex, 'checked'], isChecked, draft);
        }
        case FORM_FIELD_ICON_INPUT_TEXT:
        case FORM_FIELD_INPUT_TEXT: {
          const inputText = pathOr('', ['value'], action.currentTarget);
          return assocPath([...action.stateDataSource, 'fieldValue'], inputText, draft);
        }
        case FORM_FIELD_CHECKBOX: {
          const isChecked = path(['checked'], action.currentTarget);
          return assocPath([...action.stateDataSource], isChecked, draft);
        }
        default:
          break;
      }
      break;
    case TREND_RADAR_ALARM_POPUP_SET_FORM_ERRORS:
      draft.formValidationErrors = action.errors;
      draft.isLoading = false;
      break;
    case TREND_RADAR_ALARM_POPUP_FORM_VALIDATION_ERROR_DISMISS:
      draft.formValidationErrors = remove(action.index, 1, draft.formValidationErrors);
      break;
    case TREND_RADAR_ALARM_POPUP_FORM_ALERT_DISMISS:
      draft.formValidationErrors = remove(action.alertIndex, 1, draft.formValidationErrors);
      break;
    case TREND_RADAR_ALARM_POPUP_SUBMIT_FORM:
      draft.backendError = null;
      draft.success = null;
      draft.isLoading = true;
      draft.formValidationErrors = [];
      break;
    case TREND_RADAR_ALARM_POPUP_SET_BACKEND_ERROR:
      draft.backendError = action.error;
      draft.isLoading = false;
      break;
    case TREND_RADAR_ALARM_POPUP_FORM_SUBMIT_SUCCESS:
      draft.success = action.success;
      draft.isLoading = false;
      break;
    case TREND_RADAR_ALARM_POPUP_FORM_DID_UNMOUNT:
      return INITIAL_STATE;
    default:
      break;
  }
  return draft;
});

export default trendRadarAlarmPopupReducer;
