export const I18N_NAMESPACE = 'pages.TopUp'
export const EMPTY_AMOUNT_VALUE = 0
export const DEFAULT_MALL_SAVE_PAYMENT_METHOD = 'MERCHANT'
export const MIN_PAID_VALUE = 10_00

export enum TopUpMethod {
  ApplePay = 'ApplePay',
  DebitOrCreditCard = 'DebitOrCreditCard',
  GooglePay = 'GooglePay',
  RegularBankTransfer = 'RegularBankTransfer',
}

export enum TopUpScreen {
  TopUpMethods = 'TopUpMethods',
  TopUpViaBankTransfer = 'TopUpViaBankTransfer',
  TopUpViaCard = 'TopUpViaCard',
}

type PaymentMethodsWithCustomScreen =
  | TopUpMethod.DebitOrCreditCard
  | TopUpMethod.RegularBankTransfer

export const TOP_UP_PAYMENT_METHOD_SCREENS: {
  [K in PaymentMethodsWithCustomScreen]: TopUpScreen
} = {
  [TopUpMethod.DebitOrCreditCard]: TopUpScreen.TopUpViaCard,
  [TopUpMethod.RegularBankTransfer]: TopUpScreen.TopUpViaBankTransfer,
}
