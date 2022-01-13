import * as Icon from '@revolut/icons'

import { CountryCode } from '@revolut/rwa-core-utils'

type DisclosureItem = {
  Icon: Icon.UiKitIconComponentType
  sectionKey: string
}

type DisclosureItems = {
  cardIssuing: DisclosureItem
  feeDisclosure: DisclosureItem
  depositProtection: DisclosureItem
  accountUsage: DisclosureItem
  communication: DisclosureItem
  privacy: DisclosureItem
}

type CountryDisclosureItems = {
  [country: string]: DisclosureItem[]
}

const disclosureItems: DisclosureItems = {
  cardIssuing: {
    Icon: Icon.Card,
    sectionKey: 'cardIssuing',
  },
  feeDisclosure: {
    Icon: Icon.Revolut,
    sectionKey: 'feeDisclosure',
  },
  depositProtection: {
    Icon: Icon.Insurance,
    sectionKey: 'depositProtection',
  },
  accountUsage: {
    Icon: Icon.Profile,
    sectionKey: 'accountUsage',
  },
  communication: {
    Icon: Icon.Chat,
    sectionKey: 'communication',
  },
  privacy: {
    Icon: Icon.LockClosed,
    sectionKey: 'privacy',
  },
}

export const countryDisclosureItems: CountryDisclosureItems = {
  [CountryCode.US]: [disclosureItems.cardIssuing, disclosureItems.depositProtection],
  [CountryCode.CA]: [
    disclosureItems.cardIssuing,
    disclosureItems.feeDisclosure,
    disclosureItems.depositProtection,
    disclosureItems.accountUsage,
    disclosureItems.communication,
    disclosureItems.privacy,
  ],
}
