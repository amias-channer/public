import React from "react"
import styled from "styled-components"
import { Z_INDEX } from "../../constants/zIndex"
import Flex from "../../design-system/Flex"
import useAppContext from "../../hooks/useAppContext"
import { Toast } from "./Toast.react"

export const ToastsContainer = () => {
  const { toasts, updateContext } = useAppContext()

  return (
    <StyledContainer>
      {toasts.elements.map(toast => (
        <Toast
          key={toast.key}
          toast={toast}
          onClose={() => updateContext({ toasts: toasts.delete(toast.key) })}
        />
      ))}
    </StyledContainer>
  )
}

const StyledContainer = styled(Flex)`
  position: fixed;
  flex-direction: column;
  align-items: flex-end;
  z-index: ${Z_INDEX.TOASTS};
  width: 100%;
  bottom: 0px;
  padding: 12px;
`
