export enum AccountDetailsWithHintsVariant {
  Light = 'LIGHT',
  Dark = 'DARK',
}

export const BG_COLOR_BY_VARIANT: { [K in AccountDetailsWithHintsVariant]: string } = {
  [AccountDetailsWithHintsVariant.Light]: 'accountDetailsLightBg',
  [AccountDetailsWithHintsVariant.Dark]: 'accountDetailsDarkBg',
}
