import React, { FC, useCallback, useContext, useReducer } from 'react'
import { useSelector } from 'react-redux'

import { NewTicketContext } from '../api/types'
import { awaitingTicketSelector } from '../redux/selectors/tickets'

export enum ChatModeAction {
  SetResourceContextMode = 'SetResourceContextMode',
  SetAccessRecoveryMode = 'SetAccessRecoveryMode',
  ResetModes = 'ResetModes',
}

export type ChatModeContext = {
  accessRecovery: boolean
  newTicketContext: NewTicketContext | null
}

type ChatModeContextAction =
  | { type: ChatModeAction.ResetModes }
  | {
      type: ChatModeAction.SetResourceContextMode
      payload: NewTicketContext
    }
  | { type: ChatModeAction.SetAccessRecoveryMode; payload: boolean }

export const contextInitialState: ChatModeContext = {
  accessRecovery: false,
  newTicketContext: null,
}

export const ChatModeGetterContext = React.createContext(contextInitialState)
export const ChatModeSetterContext = React.createContext<
  (action: ChatModeContextAction) => void
>(() => {})

export const chatContextReducer = (
  state: ChatModeContext,
  action: ChatModeContextAction
) => {
  switch (action.type) {
    case ChatModeAction.SetAccessRecoveryMode:
      return { ...state, accessRecovery: action.payload }
    case ChatModeAction.SetResourceContextMode:
      return { ...state, newTicketContext: action.payload }
    case ChatModeAction.ResetModes:
      return contextInitialState
    default:
      return state
  }
}

export const ChatModeProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(chatContextReducer, contextInitialState)
  return (
    <ChatModeGetterContext.Provider value={state}>
      <ChatModeSetterContext.Provider value={dispatch}>
        {children}
      </ChatModeSetterContext.Provider>
    </ChatModeGetterContext.Provider>
  )
}

export const useSetAccessRecoveryMode = () => {
  const dispatch = useContext(ChatModeSetterContext)
  return useCallback(
    (isAccessRecovery: boolean) => {
      dispatch({
        type: ChatModeAction.SetAccessRecoveryMode,
        payload: isAccessRecovery,
      })
    },
    [dispatch]
  )
}

export const useSetNewTicketContext = () => {
  const dispatch = useContext(ChatModeSetterContext)
  return useCallback(
    (newTicketContext: NewTicketContext) => {
      dispatch({
        type: ChatModeAction.SetResourceContextMode,
        payload: newTicketContext,
      })
    },
    [dispatch]
  )
}

export const useNewTicketContext = () => {
  const { newTicketContext } = useContext(ChatModeGetterContext)
  return newTicketContext
}

export const useIsAccessRecovery = () => {
  const tickets = useSelector(awaitingTicketSelector)
  const { accessRecovery } = useContext(ChatModeGetterContext)
  return accessRecovery && !tickets.length
}
