import React, { useState, useEffect } from "react"
import styled, { css } from "styled-components"
import { Icon, MaterialIcon } from "../../components/common/Icon.react"
import { sizeMQ } from "../../components/common/MediaQuery.react"
import { selectClassNames } from "../../lib/helpers/styling"
import { themeVariant } from "../../styles/styleUtils"
import { Block } from "../Block"
import Flex from "../Flex"
import UnstyledButton from "../UnstyledButton"

export type ToastVariant = "primary" | "success" | "warning" | "error"

export interface ToastT {
  variant: ToastVariant
  key: string
  icon: MaterialIcon
  title: string
}

interface Props {
  toast: ToastT
  onClose: (key: string) => unknown
  timeout?: number
}

export const Toast = ({
  toast: { key, variant, icon, title },
  onClose,
  timeout = 10000, // 10s
}: Props) => {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsClosing(true)
    }, timeout)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [timeout])

  return (
    <DivContainer
      className={selectClassNames("Toast", { isClosing })}
      role="alert"
      variant={variant}
      onAnimationEnd={() => isClosing && onClose(key)}
    >
      <Flex alignItems="center">
        <Block marginRight="14px">
          <Icon value={icon} />
        </Block>
        {title}
      </Flex>

      <UnstyledButton aria-label="Close" onClick={() => onClose(key)}>
        <Icon className="Toast--close-icon" value="close" />
      </UnstyledButton>
    </DivContainer>
  )
}

export default Toast

const DivContainer = styled.div<{ variant: ToastVariant }>`
  font-size: 16px;
  font-weight: 600;
  box-sizing: border-box;
  animation: fadeInRight ease-in-out 0.4s;

  border-radius: 5px;
  height: 64px;
  max-width: 365px;
  width: 100%;
  padding: 10px 15px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 5px solid ${props => props.theme.colors[props.variant]};

  ${props =>
    themeVariant({
      variants: {
        light: {
          backgroundColor: props.theme.colors.charcoal,
          color: props.theme.colors.white,
        },
        dark: {
          backgroundColor: props.theme.colors.ash,
          color: props.theme.colors.cloud,
        },
      },
    })}

  .Toast--close-icon {
    color: ${props => props.theme.colors.fog};

    &:hover {
      cursor: pointer;
      font-weight: 800;
    }
  }

  &.Toast--isClosing {
    animation: fadeOutRight ease-in-out 0.4s;
  }

  ${sizeMQ({
    medium: css`
      max-width: 665px;
    `,
    small: css`
      max-width: 465px;
    `,
  })}

  @keyframes fadeInRight {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeOutRight {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`
