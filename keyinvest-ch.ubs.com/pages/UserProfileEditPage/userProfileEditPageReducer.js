import { produce } from 'immer';
import {
  USER_PROFILE_EDIT_PAGE_FETCH_DATA,
  USER_PROFILE_EDIT_PAGE_FORM_FIELD_CHANGE,
  USER_PROFILE_EDIT_PAGE_GOT_DATA,
  USER_PROFILE_EDIT_PAGE_GOT_ERROR,
  USER_PROFILE_EDIT_PAGE_SUBMIT_FORM,
  USER_PROFILE_EDIT_PAGE_SUBMIT_FORM_SUCCESS,
} from './actions';

const INITIAL_STATE = {
  data: {
    userProfile: {},
  },
  isLoading: false,
  error: null,
  isFormLoading: false,
  updateSuccessful: null,
};

const userProfileEditPageReducer = (state = INITIAL_STATE, action) => produce(state, (draft) => {
  switch (action.type) {
    case USER_PROFILE_EDIT_PAGE_FETCH_DATA:
      draft.isLoading = true;
      draft.updateSuccessful = null;
      break;
    case USER_PROFILE_EDIT_PAGE_GOT_DATA:
      draft.data = action.data;
      draft.isLoading = false;
      draft.error = null;
      draft.isFormLoading = false;
      break;
    case USER_PROFILE_EDIT_PAGE_GOT_ERROR:
      draft.error = action.error;
      draft.isLoading = false;
      draft.isFormLoading = false;
      break;
    case USER_PROFILE_EDIT_PAGE_FORM_FIELD_CHANGE:
      draft.data.userProfile[action.fieldKey] = action.newValue;
      break;
    case USER_PROFILE_EDIT_PAGE_SUBMIT_FORM:
      draft.updateSuccessful = null;
      draft.isFormLoading = true;
      draft.error = null;
      break;
    case USER_PROFILE_EDIT_PAGE_SUBMIT_FORM_SUCCESS:
      draft.updateSuccessful = true;
      break;
    default:
      break;
  }
});

export default userProfileEditPageReducer;
