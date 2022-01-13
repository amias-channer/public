import { all, fork } from 'redux-saga/effects'

import ticketSagas from './ticket'
import messageSagas from './message'
import authSagas from './auth'
import fileSagas from './file'
import wsSagas from './wsockets'
import agents from './agents'
import survey from './survey'
import wsServiceEvents from './wsServiceEvents'
import onMessage from './onMessage'
import { isOffline } from './userInfo/isOffline'

export default function* rootSaga() {
  yield all([
    fork(ticketSagas),
    fork(messageSagas),
    fork(fileSagas),
    fork(isOffline),
    fork(authSagas),
    ...wsSagas,
    ...agents,
    ...survey,
    ...wsServiceEvents,
    ...onMessage,
  ])
}
