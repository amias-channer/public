import axios from 'axios'

import { HttpHeader, getCurrentLocale } from '@revolut/rwa-core-utils'

import {
  SOWLatestSubmission,
  SOWFlowStates,
  SOWAnswerQuestionRequest,
} from '../../types/generated/sow'

import { API_PREFIX } from '../../utils'

export const getSubmissionLatest = async (): Promise<SOWLatestSubmission> => {
  const { data } = await axios.get<SOWLatestSubmission>(
    `${API_PREFIX}/user/current/submissions/sow/v6/latest`,
    {
      headers: {
        [HttpHeader.AcceptLanguage]: getCurrentLocale(),
      },
    },
  )

  return data
}

export const getSubmissionSowState = async (): Promise<SOWFlowStates> => {
  const { data } = await axios.get<SOWFlowStates>(
    `${API_PREFIX}/user/current/submissions/states`,
    {
      headers: {
        [HttpHeader.AcceptLanguage]: getCurrentLocale(),
      },
    },
  )

  return data
}

export const submitSubmissionQuestions = (data: SOWAnswerQuestionRequest[]) => {
  return Promise.all(
    data.map((question) =>
      axios.post(`${API_PREFIX}/user/current/submissions/sow/v6/questions`, question),
    ),
  )
}

export const confirmSubmissionUpload = async () => {
  const { data } = await axios.put(
    `${API_PREFIX}/user/current/submissions/sow/v6/confirm-upload`,
  )

  return data
}
