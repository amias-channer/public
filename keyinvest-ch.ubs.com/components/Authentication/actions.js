export const AUTHENTICATION_TOGGLE_AUTH_POPUP = 'Authentication/AUTHENTICATION_TOGGLE_AUTH_POPUP';

export const AUTHENTICATION_UNAUTHORIZED_ACCESS = 'Authentication/AUTHENTICATION_UNAUTHORIZED_ACCESS';

export const AUTHENTICATION_SET_USER_LOGGED_IN = 'Authentication/AUTHENTICATION_SET_USER_LOGGED_IN';
export const AUTHENTICATION_SET_USER_LOGGED_OUT = 'Authentication/AUTHENTICATION_SET_USER_LOGGED_OUT';

export function authTogglePopup(showTopAuthPopup) {
  return {
    type: AUTHENTICATION_TOGGLE_AUTH_POPUP,
    showTopAuthPopup,
  };
}

export function authUnauthorizedAccess(payload) {
  return {
    type: AUTHENTICATION_UNAUTHORIZED_ACCESS,
    payload,
  };
}

export function authSetUserLoggedIn(payload) {
  return {
    type: AUTHENTICATION_SET_USER_LOGGED_IN,
    payload,
  };
}

export function authSetUserLoggedOut() {
  return {
    type: AUTHENTICATION_SET_USER_LOGGED_OUT,
  };
}
