import { takeEvery, call, put, all, select } from 'redux-saga/effects'

import { getAgentInfo, getAgentAvatar } from '../../api/API'
import { GetAgentInfoResponseType } from '../../api/types'
import * as agentActions from '../reducers/agents'
import { agentByIdSelector } from '../selectors/agents'
import { onLoadImage } from '../../helpers/utils'
import { BOT_IDS_TO_IGNORE } from '../../constants/agents'

import { getError } from './helpers'

function* fetchAgentSaga({ payload: agentId }: { payload: string }) {
  try {
    const hasAgent = yield select(agentByIdSelector(agentId))

    if (hasAgent || !agentId || BOT_IDS_TO_IGNORE.includes(agentId)) {
      return
    }

    const [info, resp]: [
      GetAgentInfoResponseType,
      { url: string }
    ] = yield all([call(getAgentInfo, agentId), call(getAgentAvatar, agentId)])

    if (resp) {
      const { response } = yield call(onLoadImage, resp.url)

      if (response) {
        info.src = response
      }
    }

    yield put(agentActions.fetchAgentInfo(info))
  } catch (error) {
    yield getError(error)
  }
}

function* watcher() {
  yield takeEvery(agentActions.fetchAgent, fetchAgentSaga)
}

export default [watcher()]
