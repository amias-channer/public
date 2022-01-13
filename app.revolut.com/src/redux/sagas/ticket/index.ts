import { all, takeEvery, takeLeading } from 'redux-saga/effects'

import * as ticketActions from '../../reducers/tickets'
import { fetchSupportOnlineSaga } from '../userInfo/fetchSupportOnline'

import { startNewChatSaga } from './startNewChat'
import { getTicketsSaga } from './getTicketsList'
import { getTicketSaga } from './getTicket'
import { readTicketSaga } from './readTicket'
import { resolveTicketSaga } from './resolveTicket'
import {
  changeTicketLanguageToEnglishSaga,
  checkTicketLanguageAvailabilitySaga,
} from './languageAvailability'

export default function* watcher() {
  yield all([
    takeEvery(ticketActions.initNewTicket, startNewChatSaga),
    takeLeading(ticketActions.fetchTicketsList, getTicketsSaga),
    takeEvery(ticketActions.fetchTicket, getTicketSaga),
    takeLeading(ticketActions.readTicket, readTicketSaga),
    takeEvery(ticketActions.resolveTicket, resolveTicketSaga),
    takeEvery(
      [
        ticketActions.fetchTicket,
        ticketActions.initNewTicket,
        ticketActions.fetchTicketsList,
      ],
      fetchSupportOnlineSaga
    ),
    takeEvery(
      ticketActions.changeTicketLanguageToEnglish,
      changeTicketLanguageToEnglishSaga
    ),
    takeEvery(
      ticketActions.checkTicketLanguageAvailability,
      checkTicketLanguageAvailabilitySaga
    ),
  ])
}
