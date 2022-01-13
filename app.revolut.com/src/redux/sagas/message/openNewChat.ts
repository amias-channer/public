import { put, take, select } from 'redux-saga/effects'
import { routerActions } from 'connected-react-router'

import { prefillInput } from '../../reducers/external'
import { authSelector } from '../../selectors/auth'
import * as authActions from '../../reducers/auth'
import { TabsEnum } from '../../../constants/routerPaths'

export function* openNewChatSaga({ payload }: { payload: string }) {
  const { clientId } = yield select(authSelector)

  if (!clientId) {
    yield put(
      authActions.signIn({
        businessName: null,
        name: null,
        anonymous: true,
        fromStorage: false,
      })
    )
    yield take(authActions.fetchUserInfo)
  }

  const { canOpenNewTicket } = yield select(authSelector)

  if (canOpenNewTicket) {
    yield put(routerActions.push(TabsEnum.NEW_CHAT))
    yield put(prefillInput(payload))
  } else {
    yield put(routerActions.push(TabsEnum.CHAT))
  }
}
