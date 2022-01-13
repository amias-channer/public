import { call, put } from 'redux-saga/effects'

import {
  changeTicketLanguageToEnglish,
  checkTicketLanguageAvailability,
} from '../../../api/API'
import { getError } from '../helpers'
import * as ticketActions from '../../reducers/tickets'

export function* changeTicketLanguageToEnglishSaga({
  payload: { ticketId, onSuccess },
}: {
  payload: { ticketId: string; onSuccess: () => void }
}) {
  try {
    yield call(changeTicketLanguageToEnglish, ticketId)
    onSuccess()
  } catch (error) {
    yield getError(error)
  }
}

export function* checkTicketLanguageAvailabilitySaga({
  payload: { ticketId },
}: {
  payload: { ticketId: string }
}) {
  try {
    const languageAvailability = yield call(
      checkTicketLanguageAvailability,
      ticketId
    )
    yield put(
      ticketActions.setTicketLanguageAvailability(
        ticketId,
        languageAvailability
      )
    )
  } catch (error) {
    yield getError(error)
  }
}
