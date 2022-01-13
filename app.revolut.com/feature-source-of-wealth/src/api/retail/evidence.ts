import axios from 'axios'

import { UUID } from '@revolut/rwa-core-types'
import { HttpHeader, getCurrentLocale } from '@revolut/rwa-core-utils'

import {
  SOWEvidenceType,
  SOWCreateEvidence,
  SOWAnswerQuestionRequest,
} from '../../types/generated/sow'

import { API_PREFIX } from '../../utils'

type SubmitEvidenceParams = {
  evidenceId: UUID
  data: SOWAnswerQuestionRequest[]
}

export const getEvidenceTypes = async (): Promise<SOWEvidenceType[]> => {
  const { data } = await axios.get<SOWEvidenceType[]>(
    `${API_PREFIX}/user/current/submissions/sow/v6/evidences/types`,
    {
      headers: {
        [HttpHeader.AcceptLanguage]: getCurrentLocale(),
      },
    },
  )

  return data
}

export const createEvidence = (data: SOWCreateEvidence) => {
  return axios.post<{ id: UUID }>(
    `${API_PREFIX}/user/current/submissions/sow/v6/evidences`,
    data,
  )
}

export const deleteEvidence = (id: UUID) => {
  return axios.delete(`${API_PREFIX}/user/current/submissions/sow/v6/evidences/${id}`)
}

export const submitEvidenceQuestions = ({ data, evidenceId }: SubmitEvidenceParams) => {
  return Promise.all(
    data.map((question) =>
      axios.post(
        `${API_PREFIX}/user/current/submissions/sow/v6/evidences/${evidenceId}/questions`,
        question,
      ),
    ),
  )
}
