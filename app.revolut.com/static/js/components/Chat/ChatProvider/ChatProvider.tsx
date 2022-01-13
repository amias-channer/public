import {
  createContext,
  FC,
  useEffect,
  useReducer,
  useContext,
  useCallback,
  useMemo,
} from 'react'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { defaultStorage, DefaultStorageKey } from '@revolut/rwa-core-utils'

import { getChatSignIn, getVerificationTokens } from 'api/support'

import {
  ChatTicket,
  ChatContextState,
  ChatContextAction,
  ChatAction,
  STATE_RATED,
} from './types'

export const contextInitialState: ChatContextState = {
  hideDepth: 0,
  displayChatButton: true,
  chatTickets: [],
  chatClientId: null,
}

export const ChatValueContext = createContext(contextInitialState)
export const ChatSetterContext = createContext<(action: ChatAction) => void>(() => {})

export const chatWidgetReducer = (state: ChatContextState, action: ChatAction) => {
  switch (action.type) {
    case ChatContextAction.RegisterHide:
      return { ...state, hideDepth: state.hideDepth + 1 }
    case ChatContextAction.UnregisterHide:
      return { ...state, hideDepth: state.hideDepth - 1 }
    case ChatContextAction.SetChatVisibility:
      return { ...state, displayChatButton: action.payload || false }
    case ChatContextAction.UpdateChatTickets:
      return { ...state, chatTickets: action.payload || [] }
    case ChatContextAction.SignIn:
      return { ...state, chatClientId: action.payload }
    default:
      return state
  }
}

export const useChatIsHidden = () => {
  const { hideDepth } = useContext(ChatValueContext)
  return hideDepth > 0
}

export const useIsChatButtonAvailable = () => {
  const { displayChatButton } = useContext(ChatValueContext)
  return displayChatButton
}

export const useChatActiveTickets = () => {
  const { chatTickets } = useContext(ChatValueContext)
  return useMemo(
    () =>
      chatTickets.filter(
        (ticket) => ticket.createdAt && !ticket.readOnly && ticket.state !== STATE_RATED,
      ),
    [chatTickets],
  )
}

export const useChatHide = () => {
  const dispatch = useContext(ChatSetterContext)
  useEffect(() => {
    dispatch({ type: ChatContextAction.RegisterHide })
    return () => dispatch({ type: ChatContextAction.UnregisterHide })
  }, [dispatch])
}

export const useUpdateTickets = () => {
  const dispatch = useContext(ChatSetterContext)
  return useCallback(
    (tickets: ChatTicket[]) => {
      dispatch({
        type: ChatContextAction.UpdateChatTickets,
        payload: tickets,
      })
    },
    [dispatch],
  )
}

export const useSetChatButtonVisibility = () => {
  const dispatch = useContext(ChatSetterContext)
  return useCallback(
    (isVisible: boolean) => {
      dispatch({
        type: ChatContextAction.SetChatVisibility,
        payload: isVisible,
      })
    },
    [dispatch],
  )
}

export const useChatClientId = () => {
  const { chatClientId } = useContext(ChatValueContext)
  return chatClientId
}

export const ChatProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(chatWidgetReducer, contextInitialState)
  const { user } = useAuthContext()

  useEffect(() => {
    ;(async () => {
      try {
        if (user?.id && !state.chatClientId) {
          const deviceId = defaultStorage.getItem(DefaultStorageKey.DeviceId)
          const response = await getVerificationTokens(deviceId)
          const { clientId, token } = response.data
          await getChatSignIn(token, clientId, deviceId)

          dispatch({
            type: ChatContextAction.SignIn,
            payload: clientId,
          })
        }
      } catch (e) {
        dispatch({
          type: ChatContextAction.SignIn,
          payload: null,
        })
      }
    })()
  }, [state.chatClientId, user?.id])

  return (
    <ChatValueContext.Provider value={state}>
      <ChatSetterContext.Provider value={dispatch}>{children}</ChatSetterContext.Provider>
    </ChatValueContext.Provider>
  )
}
