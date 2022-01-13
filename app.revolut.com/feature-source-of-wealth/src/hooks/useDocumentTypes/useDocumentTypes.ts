import { find } from 'lodash'

import { useEvidenceTypes } from '../api/useEvidenceTypes'

export const useDocumentTypes = (incomeSourceType?: string) => {
  const { evidenceTypes, isLoading } = useEvidenceTypes()

  const documents = find(evidenceTypes, ({ type }) => type === incomeSourceType)

  return {
    documentTypes: documents?.documentTypes,
    questionTypes: documents?.questionTypes,
    isLoading,
  }
}
