import copy from 'copy-to-clipboard'
import noop from 'lodash/noop'
import { FC, useEffect, useState } from 'react'
import { TextButton } from '@revolut/ui-kit'

import { FormattedMessage } from '../../FormattedMessage'

export type CopyRenderFunctionProps = { isCopied: boolean }

const renderDefault = (state: CopyRenderFunctionProps) =>
  state.isCopied ? (
    <FormattedMessage
      namespace="components.CopyButton"
      id="actions.copied"
      defaultMessage="Copied"
    />
  ) : (
    <FormattedMessage
      namespace="components.CopyButton"
      id="actions.copy"
      defaultMessage="Copy"
    />
  )

type CopyButtonProps = {
  use?: React.ComponentType
  timeout?: number
  children?: ({ isCopied }: CopyRenderFunctionProps) => React.ReactNode
  onCopyStateChange?: (isCopied: boolean) => void
  value: string
}

const DEFAULT_COPY_MESSAGE_APPEARING_TIMEOUT = 3000

export const CopyButton: FC<CopyButtonProps> = ({
  use,
  timeout = DEFAULT_COPY_MESSAGE_APPEARING_TIMEOUT,
  value,
  onCopyStateChange,
  children,
  ...rest
}) => {
  const [isCopied, setCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, timeout)

      return () => clearTimeout(timer)
    }
    return noop
  }, [isCopied, timeout])

  useEffect(() => {
    if (onCopyStateChange) {
      onCopyStateChange(isCopied)
    }
  }, [isCopied, onCopyStateChange])

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()

    copy(value)
    setCopied(true)
  }

  const renderFunction = children || renderDefault
  const Component = use || TextButton

  return (
    <Component onClick={handleClick} disabled={isCopied} {...rest}>
      {renderFunction({ isCopied })}
    </Component>
  )
}
