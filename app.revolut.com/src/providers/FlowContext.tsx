import React, {
  createContext,
  useContext,
  FC,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

type State = {
  flowId: string
  isContinueButtonVisible: boolean
  setIsContinueButtonVisible: Dispatch<SetStateAction<boolean>>
  moveToTheNextView: () => void
}

export const FlowContext = createContext<State>({
  flowId: '',
  isContinueButtonVisible: true,
  setIsContinueButtonVisible: () => {},
  moveToTheNextView: () => {},
})

export const FlowContextProvider: FC<{
  flowId: string
  moveToTheNextView: () => void
}> = ({ flowId, moveToTheNextView, children }) => {
  const [isContinueButtonVisible, setIsContinueButtonVisible] = useState(true)

  return (
    <FlowContext.Provider
      value={{
        flowId,
        isContinueButtonVisible,
        setIsContinueButtonVisible,
        moveToTheNextView,
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}

export const useFlowId = () => {
  const { flowId } = useContext(FlowContext)
  return flowId
}

export const useIsContinueButtonVisible = () => {
  const { isContinueButtonVisible } = useContext(FlowContext)
  return isContinueButtonVisible
}

export const useSetIsContinueButtonVisible = () => {
  const { setIsContinueButtonVisible } = useContext(FlowContext)
  return setIsContinueButtonVisible
}

export const useMoveToTheNextView = () => {
  const { moveToTheNextView } = useContext(FlowContext)
  return moveToTheNextView
}
