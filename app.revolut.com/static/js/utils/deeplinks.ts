import qs from 'qs'

type LinkMappingItem = { link: string; shouldPassParams: boolean }
const appDeeplinksMapping = {
  '/topup-bank-transfer': {
    link: '/accounts/topup',
    shouldPassParams: false,
  },
  '/chat': {
    link: '/help',
    shouldPassParams: false,
  },
  '/topup-card': {
    link: '/accounts/topup',
    shouldPassParams: false,
  },
  '/mobile-topup': {
    link: '/accounts/topup',
    shouldPassParams: false,
  },
  '/topup-method': {
    link: '/auto-topup',
    shouldPassParams: false,
  },
  '/cards': {
    link: '/cards/overview',
    shouldPassParams: false,
  },
  '/add-rev-card': {
    link: '/cards/order',
    shouldPassParams: false,
  },
  '/faq': {
    link: '/help',
    shouldPassParams: false,
  },
  '/faq?key=': {
    link: '/help',
    shouldPassParams: true,
  },
}

const MOBILE_APP_DEEPLINK_PREFIX = 'revolut://app'
const QUESTION_KEY_PREFIX = 'question'
const CATEGORY_KEY_PREFIX = 'category'
const AVAILABLE_IN_MOBILE_ONLY_COMMENT = '(available in Revolut mobile app only)'

enum Scope {
  Chat = 'Chat',
  FAQ = 'FAQ',
}

enum ContentType {
  Message = 'message',
  Banner = 'banner',
}

const getMappedLink = (originalLink: string) =>
  Object.keys(appDeeplinksMapping).reduce(
    (result: { link: string; shouldPassParams: boolean } | undefined, link: string) => {
      if (originalLink.startsWith(link) && appDeeplinksMapping[link]) {
        result = appDeeplinksMapping[link]
      }
      return result
    },
    undefined,
  )

const getLinkMarkup = (
  scope: Scope,
  linkMappingItem: LinkMappingItem,
  label: string,
  link: string,
) => {
  if (linkMappingItem.shouldPassParams) {
    const paramsFromOriginalLinkParsed = qs.parse(link.slice(link.lastIndexOf('?') + 1))

    const keyParameter = paramsFromOriginalLinkParsed?.key

    if (keyParameter && typeof keyParameter === 'string') {
      const keyPrefix = keyParameter?.startsWith(QUESTION_KEY_PREFIX)
        ? QUESTION_KEY_PREFIX
        : CATEGORY_KEY_PREFIX

      const questionKey = keyParameter?.slice(keyPrefix.length + 1)
      if (questionKey) {
        if (scope === Scope.Chat) {
          return `[${label}](${linkMappingItem.link}/${questionKey})`
        }

        return `<a href="${linkMappingItem.link}/${questionKey}">${label}</a>`
      }
    }
  }

  if (scope === Scope.Chat) {
    return `[${label}](${linkMappingItem.link})`
  }

  return `<a href="${linkMappingItem.link}">${label}</a>`
}

const getLabelParameter = (scope: Scope, group1: string, group2: string) => {
  if (scope === Scope.Chat) {
    return group1
  }

  return group2
}

const getLinkParameter = (scope: Scope, group1: string, group2: string) => {
  if (scope === Scope.Chat) {
    return group2
  }

  return group1
}

const getReplacer =
  (scope: Scope) => (matched: string, group1: string, group2: string) => {
    const label = getLabelParameter(scope, group1, group2)
    const link = getLinkParameter(scope, group1, group2)
    if (matched.includes(MOBILE_APP_DEEPLINK_PREFIX)) {
      const mappedLink = getMappedLink(link)
      if (mappedLink) {
        return getLinkMarkup(scope, mappedLink, label, link)
      }
      return `${label} ${AVAILABLE_IN_MOBILE_ONLY_COMMENT}`
    }
    return matched
  }

const getPattern = (scope: Scope) => {
  if (scope === Scope.FAQ) {
    return new RegExp(/<a href="revolut:\/\/app(.+?)">(.+?)<\/a>/g)
  }
  return new RegExp(/\[([^[]+?)\]\(revolut:\/\/app(.+?)\)/gm)
}

const getMobileDeeplinksMapper = (scope: Scope) => (content: string, _?: ContentType) => {
  let r = content
  if (content && typeof content === 'string') {
    const pattern = getPattern(scope)
    const replacer = getReplacer(scope)
    r = content.replace(pattern, replacer)
  }

  return r
}

export const mapMobileAppDeeplinksToWebAppLinksInFaq = getMobileDeeplinksMapper(Scope.FAQ)
export const mapMobileAppDeeplinksToWebAppLinksInChat = getMobileDeeplinksMapper(
  Scope.Chat,
)
