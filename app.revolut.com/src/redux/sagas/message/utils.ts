import * as R from 'ramda'
import { call, put } from 'redux-saga/effects'

import * as bannerActions from '../../reducers/banners'
import {
  WRONG_SIZE_FILE_BANNER,
  WRONG_TYPE_FILE_BANNER,
  SOMETHING_WENT_WRONG_BANNER,
} from '../../../constants/banners'
import {
  ACCEPTED_UPLOAD_TYPES,
  UPLOAD_SIZE_LIMIT,
} from '../../../constants/upload'
import { onLoadFile } from '../../../helpers/utils'
import { PayloadType } from '../../../api/types'

export function* getMessagePayload(value: string | FormData) {
  if (R.is(FormData, value)) {
    const rawFileResult = (value as FormData).get('file')
    if (!rawFileResult || R.is(String, rawFileResult)) {
      yield put(bannerActions.addBanner(SOMETHING_WENT_WRONG_BANNER))
      return null
    }

    const file = rawFileResult as File

    if (!ACCEPTED_UPLOAD_TYPES.test(file.type)) {
      yield put(bannerActions.addBanner(WRONG_TYPE_FILE_BANNER))
      return null
    }

    if (file.size > UPLOAD_SIZE_LIMIT) {
      yield put(bannerActions.addBanner(WRONG_SIZE_FILE_BANNER))
      return null
    }

    const { result } = yield call(onLoadFile, file)

    return {
      mediaType: file.type,
      type: PayloadType.UPLOAD,
      url: result || null,
      name: file.name,
      size: file.size,
    }
  }

  return {
    type: PayloadType.TEXT,
    text: value,
  }
}
