import * as React from 'react'
import { put, call } from 'redux-saga/effects'
import AutoLink from 'react-autolink-text2'
import { check } from 'is-offline'

import * as bannerActions from '../reducers/banners'
import {
  SOMETHING_WENT_WRONG_BANNER,
  IS_OFFLINE_BANNER,
  COMMON_BANNER,
} from '../../constants/banners'

export function* getError(e: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(e)
  }
  const isOffline = yield call(check)
  if (isOffline) {
    yield put(bannerActions.addBanner(IS_OFFLINE_BANNER))
  } else {
    yield put(bannerActions.addBanner(SOMETHING_WENT_WRONG_BANNER))
  }
}

export function* getBanner(text: string) {
  yield put(
    bannerActions.addBanner({
      text: <AutoLink text={text} />,
      ...COMMON_BANNER,
    })
  )
}
