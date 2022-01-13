import { useContext, createContext } from 'react'
import { SendChatEvent } from '../helpers/types'

export const AnalyticsContext = createContext<SendChatEvent>(
  {} as SendChatEvent
)

export const useSendChatEvent = () => useContext(AnalyticsContext)
