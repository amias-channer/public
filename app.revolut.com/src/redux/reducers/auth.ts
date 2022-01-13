import { createAction, createReducer } from 'redux-act'

import {
  ClientInfoResponseType,
  AnonymousSigninResponseType,
  StorageSigninType,
} from '../../api/types'
import { AuthActions, UserInfoActions } from '../actions/auth'

const defaultState = {
  isOffline: false,
}

export type SignInProps = AnonymousSigninResponseType | StorageSigninType

export const signIn = createAction<SignInProps>(AuthActions.SIGNIN)
export const loginSuccess = createAction<SignInProps>(
  AuthActions.SIGNIN_SUCCESS
)
export const logout = createAction(AuthActions.LOGOUT)
export const relogin = createAction(AuthActions.RELOGIN)

export const fetchUserInfo = createAction<ClientInfoResponseType>(
  UserInfoActions.FETCH
)
export const fetchSupportTime = createAction<{
  isSupportOnline?: boolean
  supportArrivalTime?: string
}>(UserInfoActions.FETCH_SUPPORT_TIME)
export const setIsOffline = createAction<boolean>(UserInfoActions.IS_OFFLINE)

const auth = createReducer(
  {
    [loginSuccess.getType()]: (state, payload) => ({
      ...state,
      ...payload,
      loggedIn: true,
    }),
    [fetchUserInfo.getType()]: (state, payload) => ({ ...state, ...payload }),
    [fetchSupportTime.getType()]: (state, payload) => ({
      ...state,
      ...payload,
    }),
    [setIsOffline.getType()]: (state, payload) => ({
      ...state,
      isOffline: payload,
    }),
    [logout.getType()]: () => ({}),
  },
  defaultState
)

export default auth
