import { call, put } from 'redux-saga/effects'

import { getFeedbackOptions } from '../../../api/API'
import { putFeedbackOptions } from '../../actions/feedback'

export function* feedbackSaga(ticketId: string) {
  const feedback = yield call(getFeedbackOptions, ticketId)
  yield put(putFeedbackOptions(feedback))
}
