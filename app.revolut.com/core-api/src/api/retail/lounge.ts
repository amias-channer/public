import axios from 'axios'

import { SmartDelayDto } from '@revolut/rwa-core-types'

export const getSmartDelayConfig = async () => {
  const { data: smartDelayConfig } = await axios.get<SmartDelayDto>(
    '/retail/smart-delay/config',
  )

  return smartDelayConfig
}
