export const POSTFIX = '-notification'

export const transformHref = (href: string, withNotification?: boolean): string => {
  const initialHrefMatches = href.match(/.*\.(png|svg|ico)/g)

  if (initialHrefMatches) {
    const initialHref = initialHrefMatches[0]
    const extensionWithDot = initialHref.match(/(?:\.)(png|svg|ico)/g)

    const notificationHref = initialHref.replace(
      new RegExp(`(${POSTFIX}|)\\.(png|svg|ico)`, 'g'),
      `${withNotification ? POSTFIX : ''}${extensionWithDot}`,
    )

    return notificationHref
  }

  return href
}

const checkIfIconLink = (linkElement: HTMLElement): boolean =>
  /\bicon\b/i.test(linkElement.getAttribute('rel') || '')

const setNotificationIcon = (linkElement: HTMLElement): void => {
  const isIconLink = checkIfIconLink(linkElement)

  if (isIconLink) {
    const href = linkElement.getAttribute('href') || ''
    const notificationHref = transformHref(href, true)

    linkElement.setAttribute('href', notificationHref)
  }
}

const resetNotificationIcon = (linkElement: HTMLElement): void => {
  const isIconLink = checkIfIconLink(linkElement)

  if (isIconLink) {
    const notificationHref = linkElement.getAttribute('href') || ''
    const initialHref = transformHref(notificationHref, false)

    linkElement.setAttribute('href', initialHref)
  }
}

const mapHeadLinks = (callback: (linkElement: HTMLElement) => void) => {
  const head = document.getElementsByTagName('head')[0]
  const links = head.getElementsByTagName('link')

  Array.from(links).forEach((link: HTMLElement) => {
    callback(link)
  })
}

export const setFaviconNotification = (): void => mapHeadLinks(setNotificationIcon)
export const resetFavicon = (): void => mapHeadLinks(resetNotificationIcon)

export const updateFavicon = (unreadCount: number) =>
  unreadCount > 0 ? setFaviconNotification() : resetFavicon()
