import { Chat as ChatWidget } from 'business-customer-chat'
import { i18n as I18nInterface } from 'i18next'
import { noop } from 'lodash'
import { useTranslation } from 'react-i18next'

import { flattenKeys } from '@revolut/rwa-core-utils'
import { defaultStorage, DefaultStorageKey } from '@revolut/rwa-core-utils'

import { getServiceDeskForm, submitServiceDeskForm, uploadServiceDeskFormFile } from 'api'
import { mapMobileAppDeeplinksToWebAppLinksInChat } from 'utils'

import { chatApi } from './chatApi'
import {
  useSetChatButtonVisibility,
  useUpdateTickets,
  useChatClientId,
} from './ChatProvider'
import {
  HELPCENTRE_API_ENDPOINT,
  MESSAGE_PAYLOAD_TYPE_TEXT,
  SUPPORT_CHAT_NAMESPACE,
} from './constants'
import { setNewChatMessageNotification, getTroubleshoots } from './helpers'
import { ChatWrapper } from './styled'

const formsAPI = {
  loadFlow: getServiceDeskForm,
  submitFlow: submitServiceDeskForm,
  uploadFile: uploadServiceDeskFormFile,
}

const getChatTranslations = (i18n: I18nInterface) =>
  flattenKeys({ supportChat: i18n.store.data[i18n.language].supportChat })

export const ChatContainer = () => {
  const chatClientId = useChatClientId()

  const setChatView = useSetChatButtonVisibility()
  const updateTickets = useUpdateTickets()

  const { i18n } = useTranslation(SUPPORT_CHAT_NAMESPACE)

  const chatTranslations = getChatTranslations(i18n)
  const handleMessage = (ticketUpdateEvent: {
    message?: {
      payload?: {
        type: string
      }
      fromClient: boolean
    }
  }) => {
    if (
      ticketUpdateEvent?.message?.payload?.type === MESSAGE_PAYLOAD_TYPE_TEXT &&
      !ticketUpdateEvent.message.fromClient
    ) {
      setNewChatMessageNotification()
    }
  }

  const handleUnreadMessagePreview = (ticket: { unread?: number }) => {
    if (ticket && ticket.unread) {
      setNewChatMessageNotification()
    }
  }

  return (
    <ChatWrapper>
      <ChatWidget
        userId={chatClientId ?? defaultStorage.getItem(DefaultStorageKey.ChatUserId)}
        sendChatEvent={noop}
        isHelpExcluded
        locale={i18n.language.replace('_', '-')}
        messages={chatTranslations}
        chatAPI={chatApi}
        formsAPI={formsAPI}
        showChatOnlyWhenActive
        helpcentrePath={HELPCENTRE_API_ENDPOINT}
        transformContent={mapMobileAppDeeplinksToWebAppLinksInChat}
        fetchPrechatSuggestion={null}
        fetchTroubleshootSuggestions={getTroubleshoots}
        onChatViewStateChange={setChatView}
        onChatChange={updateTickets}
        onDisplayUnreadMessagePreview={handleUnreadMessagePreview}
        onMessage={handleMessage}
      />
    </ChatWrapper>
  )
}
