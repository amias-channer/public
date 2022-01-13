import React, { useCallback, useState, Component } from 'react'
import { RouteComponentProps } from 'react-router'
import { FormWidget, FormsApi } from 'revolut-forms'

import { history } from '../../redux/stores/history'
import { getLinkToChatTicket } from '../../helpers/utils'

import { SuccessFormSubmissionPopup } from './SuccessFormSubmissionPopup'
import { ErrorSlide } from './ErrorSlide'

class ErrorBoundary extends Component {
  static getDerivedStateFromError(error: any) {
    return { error }
  }

  state = {
    error: null,
  }

  render() {
    if (this.state.error) {
      return <ErrorSlide errorText='' onRetry={() => {}} />
    }

    return this.props.children
  }
}

type Props = RouteComponentProps<{ formId: string }> & {
  formsAPI: FormsApi
  closeChat: () => void
}

export const Form = ({ match, formsAPI, closeChat }: Props) => {
  const [requestChatTicketId, setRequestChatTicketId] = useState<
    string | undefined
  >()

  const openChatTicket = useCallback((ticketId: string) => {
    history.push(getLinkToChatTicket(ticketId))
  }, [])

  const onFlowComplete = (response?: { id: string }) => {
    if (response) {
      setRequestChatTicketId(response.id)
    } else {
      closeChat()
    }
  }

  return (
    <>
      <ErrorBoundary>
        <FormWidget
          api={formsAPI}
          onFlowComplete={onFlowComplete}
          flowId={match.params.formId}
        />
      </ErrorBoundary>

      <SuccessFormSubmissionPopup
        isOpen={!!requestChatTicketId}
        onExit={closeChat}
        onViewTicketClick={() =>
          requestChatTicketId && openChatTicket(requestChatTicketId)
        }
      />
    </>
  )
}
