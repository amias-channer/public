import { put, select } from 'redux-saga/effects'

import {
  isSupportOnlineSelector,
  workHoursSelector,
} from '../../selectors/auth'
import * as bannerActions from '../../reducers/banners'
import { SUPPORT_OFFLINE_BANNER } from '../../../constants/banners'

export function* fetchSupportOnlineSaga() {
  const isSupportOnline = yield select(isSupportOnlineSelector)

  if (!isSupportOnline) {
    const workHours = yield select(workHoursSelector)
    yield put(bannerActions.addBanner(SUPPORT_OFFLINE_BANNER(workHours)))
  }
}
