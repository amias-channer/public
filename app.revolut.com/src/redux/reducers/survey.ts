import { createAction, createReducer } from 'redux-act'

import { ChatRateState } from '../../api/types'

type ReducerType = {
  rateState: ChatRateState
}

const survey = createReducer<ReducerType>({}, { rateState: ChatRateState.NONE })

export const setSurveyRateState = createAction<ChatRateState>(
  'set survey rate state'
)
survey.on(setSurveyRateState, (state, payload: ChatRateState) => ({
  ...state,
  rateState: payload,
}))

export const rateTicket = createAction(
  'rate ticket',
  (
    onRated: (s: string) => void,
    ticketId: string,
    rate: number,
    feedbackId: string,
    feedback: string
  ) => ({
    onRated,
    ticketId,
    rate,
    feedbackId,
    feedback,
  })
)

export default survey
