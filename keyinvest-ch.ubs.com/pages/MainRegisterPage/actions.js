export const MAIN_REGISTER_FETCH_CONTENT = 'MainRegisterPage/MAIN_REGISTER_FETCH_CONTENT';
export const MAIN_REGISTER_GOT_CONTENT = 'MainRegisterPage/MAIN_REGISTER_GOT_CONTENT';
export const MAIN_REGISTER_POST_FORM_DATA = 'MainRegisterPage/MAIN_REGISTER_POST_FORM_DATA';
export const MAIN_REGISTER_BEFORE_FORM_SUBMIT = 'MainRegisterPage/MAIN_REGISTER_BEFORE_FORM_SUBMIT';
export const MAIN_REGISTER_FORM_SUBMIT_SUCCESS = 'MainRegisterPage/MAIN_REGISTER_FORM_SUBMIT_SUCCESS';
export const MAIN_REGISTER_FORM_SUBMIT_ERROR = 'MainRegisterPage/MAIN_REGISTER_FORM_SUBMIT_ERROR';


export function mainRegisterFetchContent() {
  return {
    type: MAIN_REGISTER_FETCH_CONTENT,
  };
}


export function mainRegisterGotContent(data) {
  return {
    type: MAIN_REGISTER_GOT_CONTENT,
    data,
  };
}

export function mainRegisterPostFormData(data) {
  return {
    type: MAIN_REGISTER_POST_FORM_DATA,
    data,
  };
}

export function mainRegisterFormSubmitSuccess(data) {
  return {
    type: MAIN_REGISTER_FORM_SUBMIT_SUCCESS,
    data,
  };
}


export function mainRegisterBeforeFormSubmit() {
  return {
    type: MAIN_REGISTER_BEFORE_FORM_SUBMIT,
  };
}

export function mainRegisterFormSubmitError(data) {
  return {
    type: MAIN_REGISTER_FORM_SUBMIT_ERROR,
    data,
  };
}
