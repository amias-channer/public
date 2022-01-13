import { call } from 'redux-saga/effects'

import { getCommonBanner } from '../../../api/API'
import { getBanner } from '../helpers'

export function* getCommonBannerSaga() {
  const bannerResponse = yield call(getCommonBanner)

  if (bannerResponse) {
    const { text } = bannerResponse
    yield getBanner(text)
  }
}
