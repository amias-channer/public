/* eslint-disable coherence/no-confusing-enum */

export enum AuthActions {
  SIGNIN = 'AUTH/SIGNIN',
  SIGNIN_SUCCESS = 'AUTH/SIGNIN_SUCCESS',
  LOGOUT = 'AUTH/LOGOUT',
  RELOGIN = 'AUTH/RELOGIN',
}

export enum UserInfoActions {
  FETCH = 'USER_INFO/FETCH',
  FETCH_SUPPORT_TIME = 'USER_INFO/FETCH_SUPPORT_TIME',
  IS_OFFLINE = 'USER_INFO/IS_OFFLINE',
}
