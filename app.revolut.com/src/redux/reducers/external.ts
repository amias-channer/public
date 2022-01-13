import { createAction, createReducer } from 'redux-act'

export const openWithPrefilledMessage = createAction('EXTERNAL/START_PREFILLED')
export const prefillInput = createAction<string>('EXTERNAL/PREFILL')

const reducer = createReducer({}, {})

reducer.on(prefillInput, (state, payload) => ({
  ...state,
  preFillMessage: payload,
}))

export default reducer
