import { takeEvery, call, put, all, select, spawn } from 'redux-saga/effects'

import { isPDFType, findFileFields } from '../../helpers/utils'
import { getFile, getPreviewImage, getImage } from '../../api/API'
import { MessageType } from '../../api/ticketTypes'
import * as messageActions from '../reducers/messages'
import { StructuredMessageFileField } from '../../constants/structuredMessage'
import { getMessage } from '../selectors/messages'

export function* fetchFileSaga(
  { payload: item }: { payload: MessageType },
  isLoadPreview?: boolean
) {
  const { messageId, correlationId, ticketId } = item
  const isFile = isPDFType(item.payload.mediaType)
  const { uploadId } = item.payload

  if (!uploadId) {
    return null
  }

  let file

  if (isFile) {
    file = yield call(getFile, uploadId)
  } else if (isLoadPreview) {
    file = yield call(getPreviewImage, uploadId)
  } else {
    file = yield call(getImage, uploadId)
  }

  yield put(
    messageActions.patchMessage(ticketId, messageId || correlationId, {
      payload: {
        url: file.url,
        name: file.fileName,
        text: file.fileName,
        type: file.mediaType,
      },
    })
  )
  return null
}

export function* fetchStructuredMessageFilesSaga(
  { payload: item }: { payload: MessageType },
  isLoadPreview?: boolean
) {
  if (!item?.payload?.content) {
    return
  }

  const fileFields: StructuredMessageFileField[] = findFileFields(
    item.payload.content
  )

  for (const fileField of fileFields) {
    const isFile = isPDFType(fileField.mediaType)
    const uploadId = fileField.id

    if (!uploadId) {
      return null
    }

    let file

    if (isFile) {
      file = yield call(getFile, uploadId)
    } else if (isLoadPreview) {
      file = yield call(getPreviewImage, uploadId)
    } else {
      file = yield call(getImage, uploadId)
    }

    fileField.url = file.url
  }
  const { messageId, correlationId, ticketId } = item

  yield put(
    messageActions.patchMessage(ticketId, messageId || correlationId, {
      payload: item.payload,
    })
  )
  return null
}

export function* updateStructuredMessageWithFilesSaga({
  payload,
}: {
  payload: { ticketId: string; uuid: string }
}) {
  const { ticketId, uuid } = payload
  const msgState = yield select(getMessage(ticketId, uuid))
  yield spawn(fetchStructuredMessageFilesSaga, {
    payload: msgState,
  })
}

export default function* watcher() {
  yield all([
    takeEvery(messageActions.getFiles, updateStructuredMessageWithFilesSaga),
  ])
}
