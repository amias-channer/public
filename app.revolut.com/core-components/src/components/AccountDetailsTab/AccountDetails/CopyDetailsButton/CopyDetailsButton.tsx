import { FC } from 'react'

import { CopyButton, CopyRenderFunctionProps } from '../../../Buttons'
import { FormattedMessage } from '../../../FormattedMessage'
import { getContentToCopy } from './helpers'
import { Detail } from './types'

type CopyDetailsButtonProps = {
  details: Detail[]
}

export const CopyDetailsButton: FC<CopyDetailsButtonProps> = ({ details }) => {
  const contentToCopy = getContentToCopy(details)

  return (
    <CopyButton value={contentToCopy} data-testid="account-details-copy-button">
      {({ isCopied }: CopyRenderFunctionProps) =>
        isCopied ? (
          <FormattedMessage
            namespace="components.AccountDetails"
            id="copyDetailsButton.copied"
            defaultMessage="Copied"
          />
        ) : (
          <FormattedMessage
            namespace="components.AccountDetails"
            id="copyDetailsButton.copyDetails"
            defaultMessage="Copy details"
          />
        )
      }
    </CopyButton>
  )
}
