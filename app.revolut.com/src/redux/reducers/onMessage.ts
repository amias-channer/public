import { createAction, createReducer } from 'redux-act'
import { MessageActions } from '../actions/messages'

type onMessageType = (...args: any[]) => void
const onMessageReducer = createReducer<{
  onMessage: null | onMessageType
}>({}, { onMessage: null })

export const setOnMessageCallback = createAction<{ onMessage: any }>(
  MessageActions.SET_ON_MESSAGE_CALLBACK
)

onMessageReducer.on(setOnMessageCallback, (state, { onMessage }) => {
  if (!onMessage) {
    return state
  }

  return {
    onMessage,
  }
})

export default onMessageReducer
