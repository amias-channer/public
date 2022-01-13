export const QUESTIONS_KEY = {
  activateCardOld: 'question.activating-my-card',
  activateCard: 'question.Activating-my-card',
  onboardingInformationNeeded:
    'question.additional-information-needed-for-onboarding',
  paypalTransferOld:
    'question.can-i-transfer-money-from-my-paypal-account-to-my-revolut-for-business-card',
  paypalTransfer:
    'question.Can-I-transfer-money-from-my-PayPal-account-to-my-Revolut-Business-card',
  creatingBusinessAccount: 'question.creating-a-business-account',
  howQuickIsTransfer: 'question.how-quick-is-my-transfer',
  makingBankTransfer: 'question.making-a-bank-transfer',
  physicalCardNotWorkingOld: 'question.my-physical-card-is-not-working',
  physicalCardNotWorking: 'question.My-physical-card-is-not-working',
  orderingNewPhysicalCard: 'question.ordering-a-new-physical-card',
  transferringMoneyIntoMyAccount: 'question.transferring-money-into-my-account',
  unsupportedInboundTransfers: 'question.unsupported-inbound-transfers',
  limitsOnOutboundGBPTransfers:
    'question.what-are-the-limits-on-outbound-domestic-gbp-transfers',
  negativeBalances: 'question.what-if-i-have-negative-account-balances',
  accountIsBlocked: 'question.what-if-my-account-is-blocked',
  notSupportedIndustries: 'question.what-industries-are-not-supported',
  withdrawalLimit: 'question.what-is-the-withdrawal-limit',
  billingAddressOfPhysicalCardOld:
    'question.what-s-the-billing-address-of-my-physical-card',
  billingAddressOfPhysicalCard:
    'question.what-is-the-billing-address-of-my-physical-card',
  supportedBusinessEntities:
    'question.what-types-of-business-entities-are-supported',
  whereCanITransferMoneyOld: 'question.where-can-i-transfer-money',
  whereCanITransferMoney: 'question.where-can-I-transfer-money',
  cardPaymentDeclinedOld: 'question.why-has-my-card-payment-been-declined',
  cardPaymentDeclined: 'question.Why-has-my-card-payment-been-declined',
  cardPaymentPendingOld: 'question.why-is-my-card-payment-still-pending',
  cardPaymentPending: 'quesion.Why-is-my-card-payment-still-pending',
  moneyTransferChargeOld: 'question.will-i-be-charged-for-transferring-money',
  moneyTransferCharge: 'question.will-I-be-charged-for-transferring-money',
} as const

export type QuestionsKey = typeof QUESTIONS_KEY[keyof typeof QUESTIONS_KEY]

// TODO: this messages shouldn't be in source code.
// consider using defineMessages for mapping the list.
export const QuestionText: { [key in QuestionsKey]?: string } = {
  [QUESTIONS_KEY.activateCardOld]: 'Activating my card',
  [QUESTIONS_KEY.activateCard]: 'Activating my card',
  [QUESTIONS_KEY.onboardingInformationNeeded]:
    'Additional information needed for onboarding',
  [QUESTIONS_KEY.paypalTransferOld]:
    'Can I transfer money from my PayPal account to my Revolut Business card?',
  [QUESTIONS_KEY.paypalTransfer]:
    'Can I transfer money from my PayPal account to my Revolut Business card?',
  [QUESTIONS_KEY.creatingBusinessAccount]: 'Creating a business account',
  [QUESTIONS_KEY.howQuickIsTransfer]: 'How quick is my transfer?',
  [QUESTIONS_KEY.makingBankTransfer]: 'Making a bank transfer',
  [QUESTIONS_KEY.physicalCardNotWorking]: 'My physical card is not working',
  [QUESTIONS_KEY.orderingNewPhysicalCard]: 'Ordering a new physical card',
  [QUESTIONS_KEY.transferringMoneyIntoMyAccount]:
    'Transferring money into my account',
  [QUESTIONS_KEY.unsupportedInboundTransfers]: 'Unsupported inbound transfers',
  [QUESTIONS_KEY.limitsOnOutboundGBPTransfers]:
    'What are the limits on outbound domestic GBP transfers?',
  [QUESTIONS_KEY.negativeBalances]: 'What if I have negative account balances?',
  [QUESTIONS_KEY.accountIsBlocked]: 'What if my account is blocked?',
  [QUESTIONS_KEY.notSupportedIndustries]: 'What industries are not supported?',
  [QUESTIONS_KEY.withdrawalLimit]: 'What is the withdrawal limit?',
  [QUESTIONS_KEY.billingAddressOfPhysicalCardOld]:
    'What’s the billing address of my physical card?',
  [QUESTIONS_KEY.billingAddressOfPhysicalCard]:
    'What’s the billing address of my physical card?',
  [QUESTIONS_KEY.supportedBusinessEntities]:
    'What types of business entities are supported?',
  [QUESTIONS_KEY.whereCanITransferMoneyOld]: 'Where can I transfer money?',
  [QUESTIONS_KEY.whereCanITransferMoney]: 'Where can I transfer money?',
  [QUESTIONS_KEY.cardPaymentDeclinedOld]:
    'Why has my card payment been declined?',
  [QUESTIONS_KEY.cardPaymentDeclined]: 'Why has my card payment been declined?',
  [QUESTIONS_KEY.cardPaymentPendingOld]:
    'Why is my card payment still pending?',
  [QUESTIONS_KEY.cardPaymentPending]: 'Why is my card payment still pending?',
  [QUESTIONS_KEY.moneyTransferChargeOld]:
    'Will I be charged for transferring money?',
  [QUESTIONS_KEY.moneyTransferCharge]:
    'Will I be charged for transferring money?',
} as const

export const LINKS_FOR_QUESTIONS: { [key in QuestionsKey]?: string } = {
  [QUESTIONS_KEY.activateCardOld]: '/cards/getting-a-card/activating-my-card',
  [QUESTIONS_KEY.activateCard]: '/cards/getting-a-card/activating-my-card',
  [QUESTIONS_KEY.onboardingInformationNeeded]:
    '/getting-started/onboarding/additional-information-needed-for-onboarding',
  [QUESTIONS_KEY.paypalTransferOld]:
    '/transactions/inbound-transfers/can-i-transfer-money-from-my-paypal-account-to-my-revolut-business-card',
  [QUESTIONS_KEY.paypalTransfer]:
    '/transactions/inbound-transfers/can-i-transfer-money-from-my-paypal-account-to-my-revolut-business-card',
  [QUESTIONS_KEY.creatingBusinessAccount]:
    '/getting-started/signing-up/creating-a-business-account',
  [QUESTIONS_KEY.howQuickIsTransfer]:
    '/transactions/outbound-transfers/sending-money-to-an-external-bank-account/how-quick-is-my-transfer',
  [QUESTIONS_KEY.makingBankTransfer]:
    '/transactions/outbound-transfers/sending-money-to-an-external-bank-account/making-a-bank-transfer',
  [QUESTIONS_KEY.physicalCardNotWorking]:
    '/cards/troubleshooting-my-card/my-physical-card-is-not-working',
  [QUESTIONS_KEY.orderingNewPhysicalCard]:
    '/cards/getting-a-card/ordering-a-new-physical-card',
  [QUESTIONS_KEY.transferringMoneyIntoMyAccount]:
    '/transactions/inbound-transfers/transferring-money-into-my-account',
  [QUESTIONS_KEY.unsupportedInboundTransfers]:
    '/transactions/inbound-transfers/unsupported-inbound-transfers',
  [QUESTIONS_KEY.limitsOnOutboundGBPTransfers]:
    '/transactions/outbound-transfers/sending-money-to-an-external-bank-account/what-are-the-limits-on-outbound-domestic-gbp-transfers',
  [QUESTIONS_KEY.negativeBalances]:
    '/getting-started/managing-my-currency-accounts/what-if-i-have-negative-account-balances',
  [QUESTIONS_KEY.accountIsBlocked]: '/profile/what-if-my-account-is-blocked',
  [QUESTIONS_KEY.notSupportedIndustries]:
    '/getting-started/is-my-business-eligible/what-industries-are-not-supported',
  [QUESTIONS_KEY.withdrawalLimit]:
    '/transactions/atm-withdrawals/what-is-the-withdrawal-limit',
  [QUESTIONS_KEY.billingAddressOfPhysicalCardOld]:
    '/cards/getting-a-card/what-s-the-billing-address-of-my-physical-card',
  [QUESTIONS_KEY.billingAddressOfPhysicalCard]:
    '/cards/getting-a-card/what-s-the-billing-address-of-my-physical-card',
  [QUESTIONS_KEY.supportedBusinessEntities]:
    '/getting-started/is-my-business-eligible/what-types-of-business-entities-are-supported',
  [QUESTIONS_KEY.whereCanITransferMoneyOld]:
    '/transactions/outbound-transfers/sending-money-to-an-external-bank-account/where-can-i-transfer-money',
  [QUESTIONS_KEY.whereCanITransferMoney]:
    '/transactions/outbound-transfers/sending-money-to-an-external-bank-account/where-can-i-transfer-money',
  [QUESTIONS_KEY.cardPaymentDeclinedOld]:
    '/transactions/card-payments/why-has-my-card-payment-been-declined',
  [QUESTIONS_KEY.cardPaymentDeclined]:
    '/transactions/card-payments/why-has-my-card-payment-been-declined',
  [QUESTIONS_KEY.cardPaymentPendingOld]:
    '/transactions/card-payments/why-is-my-card-payment-still-pending',
  [QUESTIONS_KEY.cardPaymentPending]:
    '/transactions/card-payments/why-is-my-card-payment-still-pending',
  [QUESTIONS_KEY.moneyTransferChargeOld]:
    '/transactions/outbound-transfers/sending-money-to-an-external-bank-account/will-i-be-charged-for-transferring-money',
  [QUESTIONS_KEY.moneyTransferCharge]:
    '/transactions/outbound-transfers/sending-money-to-an-external-bank-account/will-i-be-charged-for-transferring-money',
} as const
