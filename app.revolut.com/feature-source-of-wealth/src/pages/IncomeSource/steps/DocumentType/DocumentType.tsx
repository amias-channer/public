import { FC, useContext, useMemo } from 'react'
import { first } from 'lodash'

import { useDocumentTypes } from '../../../../hooks'
import { DocumentType as DocumentTypeForm, DocumentFormSubmit } from '../../../../forms'

import { StepComponentCommonProps } from '../../types'
import { IncomeSourceContext } from '../../providers'

export const DocumentType: FC<StepComponentCommonProps> = ({ onForward }) => {
  const { setDocumentTypes, setCurrentDocumentType, evidenceForm } =
    useContext(IncomeSourceContext)

  const { documentTypes, isLoading } = useDocumentTypes(evidenceForm?.incomeSource)

  const documentTypesOptions = useMemo(() => {
    return documentTypes?.map((types) => first(types))
  }, [documentTypes])

  const getDocumentTypes = (type: string) => {
    return documentTypes?.find((types) => first(types)?.type === type)
  }

  const handleSubmit: DocumentFormSubmit = (values) => {
    setDocumentTypes(getDocumentTypes(values.documentType), values.userDefinedType)
    setCurrentDocumentType(values.documentType)

    onForward()
  }

  return (
    <DocumentTypeForm
      documentTypes={documentTypesOptions}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  )
}
