export const USER_PROFILE_EDIT_PAGE_FETCH_DATA = 'UserProfileEditPage/USER_PROFILE_EDIT_PAGE_FETCH_DATA';
export const USER_PROFILE_EDIT_PAGE_GOT_DATA = 'UserProfileEditPage/USER_PROFILE_EDIT_PAGE_GOT_DATA';
export const USER_PROFILE_EDIT_PAGE_GOT_ERROR = 'UserProfileEditPage/USER_PROFILE_EDIT_PAGE_GOT_ERROR';
export const USER_PROFILE_EDIT_PAGE_FORM_FIELD_CHANGE = 'UserProfileEditPage/USER_PROFILE_EDIT_PAGE_FORM_FIELD_CHANGE';
export const USER_PROFILE_EDIT_PAGE_SUBMIT_FORM = 'UserProfileEditPage/USER_PROFILE_EDIT_PAGE_SUBMIT_FORM';
export const USER_PROFILE_EDIT_PAGE_SUBMIT_FORM_SUCCESS = 'UserProfileEditPage/USER_PROFILE_EDIT_PAGE_SUBMIT_FORM_SUCCESS';

export function userProfileEditPageFetchData(url) {
  return {
    type: USER_PROFILE_EDIT_PAGE_FETCH_DATA,
    url,
  };
}

export function userProfileEditPageGotData(data) {
  return {
    type: USER_PROFILE_EDIT_PAGE_GOT_DATA,
    data,
  };
}

export function userProfileEditPageGotError(error) {
  return {
    type: USER_PROFILE_EDIT_PAGE_GOT_ERROR,
    error,
  };
}

export function userProfileEditPageFormFieldChange(fieldKey, newValue) {
  return {
    type: USER_PROFILE_EDIT_PAGE_FORM_FIELD_CHANGE,
    fieldKey,
    newValue,
  };
}

export function userProfileEditPageSubmitForm(url) {
  return {
    type: USER_PROFILE_EDIT_PAGE_SUBMIT_FORM,
    url,
  };
}

export function userProfileEditPageSubmitFormSuccess(message) {
  return {
    type: USER_PROFILE_EDIT_PAGE_SUBMIT_FORM_SUCCESS,
    message,
  };
}
