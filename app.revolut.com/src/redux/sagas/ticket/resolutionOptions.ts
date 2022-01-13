import { call, put } from 'redux-saga/effects'

import { getResolutionOptions } from '../../../api/API'
import * as resolutionOptionsActions from '../../reducers/resolutionOptions'

export function* ticketResolutionOptionsSaga(ticketId: string) {
  const options = yield call(getResolutionOptions, ticketId)
  yield put(resolutionOptionsActions.setResolutionOptions(options))
}
