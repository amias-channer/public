import { createReducer, createAction } from 'redux-act'

import { ResolutionOptionsType } from '../../api/types'

export type ReducerStateType = ResolutionOptionsType | null

const resolutionOptions = createReducer<ReducerStateType>({}, null)

export const setResolutionOptions = createAction<ResolutionOptionsType>(
  'RESOLUTION_OPTIONS/SET'
)

resolutionOptions.on(setResolutionOptions, (_, payload) => payload)

export default resolutionOptions
