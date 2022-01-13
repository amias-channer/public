import { CardCode, Dictionary } from '@revolut/rwa-core-types'

type CardDesignText = Dictionary<{ title: string; description: string }>

// TODO: replace hardcoded values with BE values when available
export const CARD_DESIGN_TEXT: CardDesignText = {
  [CardCode.OriginalV2]: {
    title: 'Standard',
    description:
      'Our free contactless debit card, made from biodegradable plastic with a metallic finish.',
  },
  [CardCode.OriginalV3]: {
    title: 'Standard',
    description:
      'Our free contactless debit card, made from biodegradable plastic with a metallic finish.',
  },
  [CardCode.Magenta]: {
    title: 'Plus',
    description:
      'Contactless debit card, made from biodegradable plastic in a metallic finish with a unique magenta edge.',
  },
  [CardCode.RoseGold]: {
    title: 'Premium rose gold',
    description: 'Beautiful, premium plastic card with a striking metallic finish.',
  },
  [CardCode.RoseGoldV2]: {
    title: 'Premium rose gold',
    description: 'Beautiful, premium plastic card with a striking metallic finish.',
  },
  [CardCode.SpaceGrey]: {
    title: 'Space Gray',
    description: 'Beautiful, premium plastic card with a striking metallic finish.',
  },
  [CardCode.SpaceGreyV2]: {
    title: 'Space Gray',
    description: 'Beautiful, premium plastic card with a striking metallic finish.',
  },
  [CardCode.Silver]: {
    title: 'Silver',
    description: 'Beautiful, premium plastic card with a striking metallic finish.',
  },
  [CardCode.SilverV2]: {
    title: 'Silver',
    description: 'Beautiful, premium plastic card with a striking metallic finish.',
  },
  [CardCode.Lavender]: {
    title: 'Lavender',
    description: 'Beautiful, premium plastic card with a striking metallic finish.',
  },
  [CardCode.Metal]: {
    title: 'Black metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.MetalV2]: {
    title: 'Black metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.GoldMetal]: {
    title: 'Gold metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.GoldMetalV2]: {
    title: 'Gold metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.SilverMetal]: {
    title: 'Silver metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.SilverMetalV2]: {
    title: 'Silver metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.RoseGoldMetal]: {
    title: 'Rose gold metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.RoseGoldMetalV2]: {
    title: 'Rose gold metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.SpaceGreyMetal]: {
    title: 'Space gray metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.SpaceGreyMetalV2]: {
    title: 'Space gray metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.LavenderMetal]: {
    title: 'Lavender metal',
    description: 'Heavyweight 17g real metal card, in a brushed stainless steel finish.',
  },
  [CardCode.FlagUk]: {
    title: 'United Kingdom · Limited edition',
    description: 'Black plastic card sporting the flag of your favourite country',
  },
  [CardCode.FlagFr]: {
    title: 'France · Limited edition',
    description: 'Black plastic card sporting the flag of your favourite country',
  },
  [CardCode.FlagEs]: {
    title: 'Spain · Limited edition',
    description: 'Black plastic card sporting the flag of your favourite country',
  },
  [CardCode.FlagIe]: {
    title: 'Ireland · Limited edition',
    description: 'Black plastic card sporting the flag of your favourite country',
  },
  [CardCode.FlagRo]: {
    title: 'Romania · Limited edition',
    description: 'Black plastic card sporting the flag of your favourite country',
  },
  [CardCode.Moon]: {
    title: 'Wen Moon · Limited edition',
    description:
      'Contactless debit card, made from biodegradable plastic with a metallic finish.',
  },
  [CardCode.Lambo]: {
    title: 'Wen Lambo · Limited edition',
    description:
      'Contactless debit card, made from biodegradable plastic with a metallic finish.',
  },
  [CardCode.Whale]: {
    title: 'Whale · Limited edition',
    description:
      'Contactless debit card, made from biodegradable plastic with a metallic finish.',
  },
}
