import React, { useEffect, useState } from "react"
import { useCopyToClipboard } from "react-use"
import styled from "styled-components"
import Tooltip, { TooltipProps } from "../../design-system/Tooltip"
import UnstyledButton from "../../design-system/UnstyledButton"
import { useTranslations } from "../../hooks/useTranslations"
import Icon from "../common/Icon.react"
import FakeInput from "../layout/FakeInput.react"
import Label from "./Label.react"

const SECOND = 1000
interface TextCopyInputProps {
  className?: string
  label?: string
  textToShow?: string
  textToCopy: string
  placement?: TooltipProps["placement"]
}

export const TextCopyInput = React.forwardRef<
  HTMLDivElement,
  TextCopyInputProps
>(function TextCopyInput(
  { textToCopy, textToShow = textToCopy, label, className, placement = "top" },
  ref,
) {
  const { tr } = useTranslations()
  const [isCopied, setIsCopied] = useState(false)
  const [_, copyToClipboard] = useCopyToClipboard()

  useEffect(() => {
    const timeout = isCopied
      ? window.setTimeout(() => setIsCopied(false), SECOND)
      : undefined

    return () => clearTimeout(timeout)
  }, [isCopied])

  const displayMessage = tr("Copied!")

  const input = (
    <FakeInput>
      <div
        style={{
          overflow: "auto",
          whiteSpace: "nowrap",
          marginRight: "16px",
        }}
      >
        {textToShow || textToCopy}
      </div>
      <Tooltip
        content={displayMessage}
        placement={placement}
        visible={isCopied}
      >
        <UnstyledButton
          aria-label="Copy"
          className={className}
          onClick={() => {
            copyToClipboard(textToCopy)
            setIsCopied(true)
          }}
        >
          <Icon
            color="gray"
            cursor="pointer"
            size={18}
            value="content_copy"
            variant="outlined"
          />
        </UnstyledButton>
      </Tooltip>
    </FakeInput>
  )

  return (
    <DivContainer className={className} ref={ref}>
      {label ? <Label label={label}>{input}</Label> : input}
    </DivContainer>
  )
})

const DivContainer = styled.div`
  .TextCopyInput--cta {
    color: ${props => props.theme.colors.primary};
    cursor: pointer;
    font-weight: 500;
  }
`

export default TextCopyInput
