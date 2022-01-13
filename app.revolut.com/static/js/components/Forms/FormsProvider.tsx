import { FC, useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Modal } from '@revolut/ui-kit'

import { chatApi } from 'components/Chat/chatApi'

import { FormModal } from './FormModal'
import { FormsContext } from './FormsContext'
import { SuccessFormSubmissionPopup } from './SuccessFormSubmissionPopup'

export const FormsProvider: FC = ({ children }) => {
  const { search: queryString } = useLocation()
  const [formId, setFormId] = useState<string>()
  const [formQueryString, setFormQueryString] = useState<string>('')
  const [ticketId, setTicketId] = useState<string>()

  const onFormComplete = useCallback((formTicketId?: string) => {
    setFormId(undefined)
    setFormQueryString('')
    if (formTicketId) {
      setTicketId(formTicketId)
    }
  }, [])

  const openForm = (id: string) => {
    setFormId(id)
    setFormQueryString(queryString)
  }

  return (
    <FormsContext.Provider value={{ openForm }}>
      {children}
      <Modal isOpen={Boolean(formId)} onRequestClose={() => setFormId(undefined)}>
        {formId && (
          <FormModal
            formId={formId}
            formQueryString={formQueryString}
            onFormComplete={onFormComplete}
            onExit={() => setFormId(undefined)}
          />
        )}
      </Modal>
      <SuccessFormSubmissionPopup
        isOpen={Boolean(ticketId)}
        onExit={() => setTicketId(undefined)}
        onViewTicketClick={() => chatApi.openChatTicket(ticketId)}
      />
    </FormsContext.Provider>
  )
}
