import * as R from 'ramda'
import { createReducer } from 'redux-act'

import * as actions from '../actions/feedback'

const reducer = createReducer({}, {})

type FeedbackType = {
  id: string
  title: string
  placeholder?: string
  type?: string
}

reducer.on(actions.putFeedbackOptions, (state, payload: FeedbackType[]) =>
  R.reduce(
    (acc, { id, ...params }) => ({ ...acc, [id]: params }),
    state,
    payload
  )
)

export default reducer
