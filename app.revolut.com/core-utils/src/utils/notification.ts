/* ATTENTION Notifications will work only in desktop browsers
   because in order to use notification on mobile we need to setup web push notifications API */

const tryRequestPermission = () => {
  try {
    return Notification.requestPermission()
  } catch (e) {
    return new Promise((resolve) => Notification.requestPermission(resolve))
  }
}

const REVOLUT_ICON = 'https://www.revolut.com/icons/icon-512x512.png'

type EnableNotificationArgs = {
  title: string
  body: string
  clickAction: (notification: Notification, ev: Event) => void
}

export const showNotification = ({
  title,
  body,
  clickAction,
}: EnableNotificationArgs) => {
  if (document.visibilityState !== 'hidden' || Notification.permission !== 'granted') {
    return
  }

  const notification = new Notification(title, {
    body,
    icon: REVOLUT_ICON,
  })

  notification.onclick = (event: Event) => {
    clickAction(notification, event)
  }

  const visibilityListener = () => {
    notification.close()

    document.removeEventListener('visibilitychange', visibilityListener)
  }

  document.addEventListener('visibilitychange', visibilityListener)
}

export const requestNotificationPermission = async () => {
  if (!('Notification' in window) || Notification.permission !== 'default') {
    return
  }

  await tryRequestPermission()
}
