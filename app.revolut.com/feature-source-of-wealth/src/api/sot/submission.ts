import axios from 'axios'

import { SOTLatestSubmission } from '../../types/generated/sot'

import { API_PREFIX } from '../../utils'

export const getSotSubmissionLatest = async (): Promise<SOTLatestSubmission> => {
  const { data } = await axios.get<SOTLatestSubmission>(
    `${API_PREFIX}/user/current/submissions/sot/v6/latest`,
  )

  return data
}
