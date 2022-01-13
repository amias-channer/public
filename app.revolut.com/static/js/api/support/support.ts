import axios from 'axios'

import { FAQItem } from 'smart-help-centre'
import { TroubleshootItemDto } from '@revolut/rwa-core-types'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { HttpHeader } from '@revolut/rwa-core-utils'

const CHAT_API_VERSION = '3.0.0'
const SUPPORT_API = '/api/support'

export const getChatSignIn = (
  verificationToken: string,
  clientId: string,
  deviceId: string | null,
) => {
  const headers = {
    [HttpHeader.ChatVersion]: CHAT_API_VERSION,
  }

  if (deviceId) {
    headers[HttpHeader.DeviceId] = deviceId
  }

  return axios.post(
    '/api/client/signin',
    {
      verificationToken,
      clientId,
    },
    {
      withCredentials: true,
      headers,
      baseURL: getChatBaseUrl(),
    },
  )
}

export const getFAQs = async (lang: string) => {
  const { data } = await axios.get<FAQItem[]>(`/faq/retail?lang=${lang}`, {
    baseURL: '/helpcentre',
  })
  return data
}

export const getVerificationTokens = (deviceId: string | null) => {
  const headers = {}

  if (deviceId) {
    headers[HttpHeader.DeviceId] = deviceId
  }

  return axios.post<{ token: string; clientId: string }>(
    '/chat/verification-tokens',
    {
      chatAppVersion: CHAT_API_VERSION,
    },
    {
      headers,
      baseURL: SUPPORT_API,
    },
  )
}

export const getTroubleshootFeed = async () => {
  const { data } = await axios.get<TroubleshootItemDto[]>('/troubleshooting/feed', {
    baseURL: SUPPORT_API,
  })
  return data
}

const getChatBaseUrl = () => getConfigValue(ConfigKey.ChatBaseUrl)
