import { StatusPopup, Button, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { FormattedMessage } from '@revolut/rwa-core-components'

type Props = {
  isOpen: boolean
  onExit: () => void
  onViewTicketClick: () => void
}

export const SuccessFormSubmissionPopup = ({
  isOpen,
  onExit,
  onViewTicketClick,
}: Props) => (
  <ThemeProvider theme={UnifiedTheme}>
    <StatusPopup variant="success-optional" isOpen={isOpen} onExit={onExit}>
      <StatusPopup.Title>
        <FormattedMessage
          namespace="components.Forms"
          id="successPopup.thankyou"
          defaultMessage="Thank you!"
        />
      </StatusPopup.Title>
      <StatusPopup.Description>
        <FormattedMessage
          namespace="components.Forms"
          id="successPopup.description"
          defaultMessage="Thank you for your submission"
        />
      </StatusPopup.Description>
      <StatusPopup.Actions>
        <Button onClick={onViewTicketClick} variant="secondary">
          <FormattedMessage
            namespace="components.Forms"
            id="successPopup.viewRequest"
            defaultMessage="View Request"
          />
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  </ThemeProvider>
)
