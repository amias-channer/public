import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'

type ChatHeaderState = {
  isChatHeaderMinimized: boolean
  isChatHeaderVisible: boolean
  setIsChatHeaderMinimized: Dispatch<SetStateAction<boolean>>
  setIsChatHeaderVisible: Dispatch<SetStateAction<boolean>>
}

export const ChatHeaderContext = createContext<ChatHeaderState>({
  isChatHeaderMinimized: true,
  isChatHeaderVisible: true,
  setIsChatHeaderMinimized: () => {},
  setIsChatHeaderVisible: () => {},
})

export const ChatHeaderProvider: FC = ({ children }) => {
  const [isChatHeaderMinimized, setIsChatHeaderMinimized] = useState(true)
  const [isChatHeaderVisible, setIsChatHeaderVisible] = useState(true)

  return (
    <ChatHeaderContext.Provider
      value={{
        isChatHeaderMinimized,
        isChatHeaderVisible,
        setIsChatHeaderMinimized,
        setIsChatHeaderVisible,
      }}
    >
      {children}
    </ChatHeaderContext.Provider>
  )
}

export const useIsChatHeaderMinimized = () => {
  const { isChatHeaderMinimized } = useContext(ChatHeaderContext)
  return isChatHeaderMinimized
}

export const useIsChatHeaderVisible = () => {
  const { isChatHeaderVisible } = useContext(ChatHeaderContext)
  return isChatHeaderVisible
}

export const useHideChatHeader = () => {
  const { setIsChatHeaderVisible } = useContext(ChatHeaderContext)
  useEffect(() => {
    setIsChatHeaderVisible(false)
    return () => {
      setIsChatHeaderVisible(true)
    }
  }, [setIsChatHeaderVisible])
}
