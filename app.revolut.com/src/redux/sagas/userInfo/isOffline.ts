import { watch } from 'is-offline'
import { take, put } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

import { setIsOffline } from '../../reducers/auth'
import {
  IS_OFFLINE_BANNER,
  SOMETHING_WENT_WRONG_ID,
} from '../../../constants/banners'
import * as bannerActions from '../../reducers/banners'

export function* isOffline() {
  const channel = eventChannel((emitter) => {
    const fn = (isOfflineChannel: boolean) => emitter(isOffline)
    watch(fn)
    return () => null
  })

  while (true) {
    const isOfflineChannel = yield take(channel)
    yield put(setIsOffline(isOfflineChannel))
    if (isOfflineChannel) {
      yield put(bannerActions.addBanner(IS_OFFLINE_BANNER))
    } else {
      yield put(bannerActions.removeBanner(SOMETHING_WENT_WRONG_ID))
    }
  }
}
