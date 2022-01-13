import { ResolutionOptionsType } from '../../api/types'
import { StateType } from '../reducers'

export const resolutionOptionsSelector = (
  state: StateType
): ResolutionOptionsType | null => state.resolutionOptions
