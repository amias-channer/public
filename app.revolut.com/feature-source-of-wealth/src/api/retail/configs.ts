import axios from 'axios'

import { HttpHeader, getCurrentLocale } from '@revolut/rwa-core-utils'

import { SOWConfig } from '../../types/generated/sow'
import { API_PREFIX } from '../../utils'

export const getSubmissionConfigs = async (): Promise<SOWConfig> => {
  const { data } = await axios.get<SOWConfig>(
    `${API_PREFIX}/user/current/submissions/sow/v6/config`,
    {
      headers: {
        [HttpHeader.AcceptLanguage]: getCurrentLocale(),
      },
    },
  )

  return data
}
