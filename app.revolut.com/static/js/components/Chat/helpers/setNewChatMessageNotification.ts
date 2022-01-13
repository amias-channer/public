import { setFaviconNotification } from 'utils'

export const setNewChatMessageNotification = () => {
  const NEW_CHAT_MESSAGE_NOTIFICATION_TEXT = 'New chat message -'
  if (document.hidden && !document.title.startsWith(NEW_CHAT_MESSAGE_NOTIFICATION_TEXT)) {
    document.title = `${NEW_CHAT_MESSAGE_NOTIFICATION_TEXT} ${document.title}`
    setFaviconNotification()
  }
}
