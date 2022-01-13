import keys from 'lodash/keys'

export enum I18nNamespace {
  Common = 'common',
  Domain = 'domain',
  SupportChat = 'supportChat',
  Helpcentre = 'helpcentre',
}

export const getI18nNamespaces = (translations: any) => {
  const namespaces = {}

  keys(translations)
    .filter(
      (key) =>
        key !== I18nNamespace.Common &&
        key !== I18nNamespace.Domain &&
        key !== I18nNamespace.SupportChat &&
        key !== I18nNamespace.Helpcentre,
    )
    .forEach((parentKey) => {
      keys(translations[parentKey]).forEach((nestedKey) => {
        namespaces[`${parentKey}.${nestedKey}`] = translations[parentKey][nestedKey]
      })
    })

  namespaces[I18nNamespace.Common] = translations[I18nNamespace.Common]
  namespaces[I18nNamespace.Domain] = translations[I18nNamespace.Domain]
  namespaces[I18nNamespace.SupportChat] = translations[I18nNamespace.SupportChat]
  namespaces[I18nNamespace.Helpcentre] = translations[I18nNamespace.Helpcentre]

  return namespaces
}
