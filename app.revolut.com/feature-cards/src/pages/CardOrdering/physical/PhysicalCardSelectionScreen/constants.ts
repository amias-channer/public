import { ValueOf } from '@revolut/rwa-core-types'

export const PhysicalCardDesignGroup = {
  Standard: 'standard',
  Plus: 'plus',
  Premium: 'premium',
  Metal: 'metal',
  Crypto: 'crypto',
  Flags: 'nationalities',
} as const

export type PhysicalCardDesignGroup = ValueOf<typeof PhysicalCardDesignGroup>

export const CardTier = {
  Standard: 10,
  Plus: 20,
  Premium: 30,
  Metal: 40,
} as const

export type CardTier = ValueOf<typeof CardTier>

export const PHYSICAL_CARD_DESIGN_GROUPS_ORDER: PhysicalCardDesignGroup[] = [
  PhysicalCardDesignGroup.Standard,
  PhysicalCardDesignGroup.Plus,
  PhysicalCardDesignGroup.Premium,
  PhysicalCardDesignGroup.Metal,
  PhysicalCardDesignGroup.Crypto,
  PhysicalCardDesignGroup.Flags,
]
