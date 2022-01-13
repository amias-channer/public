import axios from 'axios'
import { map } from 'lodash'

import { UUID, Dictionary } from '@revolut/rwa-core-types'

import { SOWDocumentTypeType } from '../../types/generated/sow'

import { API_PREFIX } from '../../utils'

export type CreateDocument = {
  evidenceId: UUID
  userDefinedType?: string
  actionToDoId?: UUID
  documents: Dictionary<File[]>
}

export const createDocuments = ({
  documents,
  evidenceId,
  userDefinedType,
  actionToDoId,
}: CreateDocument) => {
  const createDocumentsQueries = map(documents, (files, key: SOWDocumentTypeType) => {
    const formData = new FormData()
    const documentsList = Array.from(files ?? [])

    documentsList.forEach((file) => {
      formData.append('documents', file)
    })

    return axios.post(
      `${API_PREFIX}/user/current/submissions/sow/v6/evidences/${evidenceId}/documents`,
      formData,
      {
        params: {
          documentType: key,
          userDefinedType,
          actionToDoId,
        },
      },
    )
  })

  return Promise.all(createDocumentsQueries)
}
