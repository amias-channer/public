import { createAction, createReducer } from 'redux-act'

type ReducerType = {
  loading: boolean
  ticketIsLoading: boolean
}

const loading = createReducer<ReducerType>(
  {},
  {
    loading: false,
    ticketIsLoading: false,
  }
)
export const setLoading = createAction<boolean>('set loading')
loading.on(setLoading, (state, payload: boolean) => ({
  ...state,
  loading: payload,
}))

export const setTicketLoading = createAction<boolean>('set loading')
loading.on(setTicketLoading, (state, payload: boolean) => ({
  ...state,
  ticketIsLoading: payload,
}))

export default loading
