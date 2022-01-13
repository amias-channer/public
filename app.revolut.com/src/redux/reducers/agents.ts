import { createReducer, createAction } from 'redux-act'
import * as R from 'ramda'

import { GetAgentInfoResponseType } from '../../api/types'

export const fetchAgent = createAction<string>('get agent')
export const fetchAgentInfo = createAction<GetAgentInfoResponseType>(
  'fetch agent info'
)
export const fetchAgentAvatar = createAction<{ id: string; src: string }>(
  'fetch agent avatar'
)

const agents = createReducer(
  {
    [fetchAgentInfo.getType()]: (state, payload) =>
      R.assoc(
        payload.id,
        R.mergeDeepLeft(payload, R.propOr({}, payload.id, state)),
        state
      ),
    [fetchAgentAvatar.getType()]: (state, payload) =>
      R.assocPath([payload.id, 'src'], payload.src, state),
  },
  {}
)

export default agents
