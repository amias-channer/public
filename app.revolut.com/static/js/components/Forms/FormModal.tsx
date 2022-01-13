import { useMemo } from 'react'
import { FormWidget } from 'revolut-forms'
import { Layout } from '@revolut/ui-kit'

import { getServiceDeskForm, submitServiceDeskForm, uploadServiceDeskFormFile } from 'api'

type Props = {
  formId: string
  formQueryString: string
  onFormComplete: (ticketId?: string) => void
  onExit: () => void
}

export const FormModal = ({ formId, formQueryString, onFormComplete, onExit }: Props) => {
  const formsAPI = useMemo(
    () => ({
      loadFlow: (id: string) => getServiceDeskForm(id, formQueryString),
      submitFlow: submitServiceDeskForm,
      uploadFile: uploadServiceDeskFormFile,
    }),
    [formQueryString],
  )

  const onFlowComplete = (response?: { id: string }) => onFormComplete(response?.id)

  return (
    <Layout>
      <Layout.Main>
        <FormWidget
          api={formsAPI}
          onBackButtonClick={onExit}
          onFlowComplete={onFlowComplete}
          flowId={formId}
        />
      </Layout.Main>
    </Layout>
  )
}
