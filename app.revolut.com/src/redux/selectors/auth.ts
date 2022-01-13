import { createSelector } from 'reselect'

type AuthState = {
  clientId?: string
  canOpenNewTicket?: boolean
  loggedIn?: boolean
  anonymous?: boolean
  supportArrivalTime?: object
  workHours?: object
  isSupportOnline?: boolean
}

export const authSelector = ({ auth }: { auth: AuthState }) => auth

export const workHoursSelector = createSelector(
  authSelector,
  ({ workHours }) => workHours || null
)

export const loggedInSelector = createSelector(
  authSelector,
  ({ loggedIn }) => loggedIn
)

export const isSupportOnlineSelector = createSelector(
  authSelector,
  ({ isSupportOnline }) => isSupportOnline || true
)

export const supportArrivalTimeSelector = createSelector(
  authSelector,
  ({ supportArrivalTime }) => supportArrivalTime || true
)
export const isAnonymousSelector = createSelector(
  authSelector,
  ({ anonymous }) => anonymous
)
