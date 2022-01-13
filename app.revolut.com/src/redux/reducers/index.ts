import { TicketsResponseType } from '../../api/ticketTypes'

import { ReducerStateType as BannersType } from './banners'
import { ReducerStateType as ResolutionOptionsType } from './resolutionOptions'

export { default as tickets } from './tickets'
export { default as auth } from './auth'
export { default as agents } from './agents'
export { default as banners } from './banners'
export { default as messages } from './messages'
export { default as survey } from './survey'
export { default as external } from './external'
export { default as loading } from './loading'
export { default as feedback } from './feedback'
export { default as onMessage } from './onMessage'
export { default as resolutionOptions } from './resolutionOptions'

export type StateType = {
  banners: BannersType
  tickets: Record<string, TicketsResponseType>
  auth: { clientId: string }
  resolutionOptions: ResolutionOptionsType
}
