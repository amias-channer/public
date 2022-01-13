import React, { useEffect, useState } from "react"
import { useCopyToClipboard } from "react-use"
import styled, { css } from "styled-components"
import Tooltip, { TooltipProps } from "../../design-system/Tooltip"
import UnstyledButton from "../../design-system/UnstyledButton"
import { useTranslations } from "../../hooks/useTranslations"

export interface TextCopierProps {
  children?: React.ReactNode
  className?: string
  label?: string
  text: string
  truncationWidth?: string
  placement?: TooltipProps["placement"]
  onCopy?: () => unknown
}

export const TextCopier = React.forwardRef<HTMLButtonElement, TextCopierProps>(
  function TextCopier(
    {
      children,
      text,
      label,
      className,
      truncationWidth,
      placement = "top",
      onCopy,
    },
    ref,
  ) {
    const { tr } = useTranslations()
    const [isCopied, setIsCopied] = useState(false)
    const [_, copyToClipboard] = useCopyToClipboard()

    useEffect(() => {
      const timeout = isCopied
        ? window.setTimeout(() => setIsCopied(false), 1000)
        : undefined

      return () => clearTimeout(timeout)
    }, [isCopied])

    const displayMessage = isCopied ? tr("Copied!") : label ?? tr("Copy")

    return (
      <Tooltip
        content={displayMessage}
        hideOnClick={false}
        placement={placement}
      >
        <StyledContainer
          className={className}
          isTruncated={truncationWidth !== undefined}
          ref={ref}
          style={{ width: truncationWidth }}
          onClick={() => {
            copyToClipboard(text)
            setIsCopied(true)
            onCopy?.()
          }}
        >
          {children || text}
        </StyledContainer>
      </Tooltip>
    )
  },
)

export default TextCopier

const StyledContainer = styled(UnstyledButton)<{ isTruncated: boolean }>`
  ${props =>
    props.isTruncated &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`
