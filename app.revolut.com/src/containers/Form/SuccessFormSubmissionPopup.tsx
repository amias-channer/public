import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  StatusPopup,
  Button,
  ThemeProvider,
  UnifiedTheme,
  Modal,
} from '@revolut/ui-kit'

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
    {/* Separate modal to shade a chat widget behind it */}
    <Modal
      isOpen={isOpen}
      style={{ position: 'absolute' }}
      usePortal={false}
      zIndex={1}
    />
    <StatusPopup variant='success-optional' isOpen={isOpen} onExit={onExit}>
      <StatusPopup.Title>
        <FormattedMessage
          id='chat.ticket.thanksForSubmission'
          defaultMessage='Thank you for your submission'
        />
      </StatusPopup.Title>

      <StatusPopup.Description>
        <FormattedMessage
          id='chat.ticket.requestReceived'
          defaultMessage='Your request has been received and will be attended to as soon as possible.'
        />
      </StatusPopup.Description>

      <StatusPopup.Actions>
        <Button variant='secondary' onClick={onViewTicketClick}>
          <FormattedMessage
            id='chat.ticket.viewTicket'
            defaultMessage='View ticket'
          />
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  </ThemeProvider>
)
