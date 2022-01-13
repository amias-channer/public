import { RetailEventOptions, COAWebEvent } from 'aqueduct-web'

import { OBJECT_TYPES } from './objectTypes'

const PAYMENTS_EVENTS = {
  homePageSendMoneyButtonClicked: {
    category: COAWebEvent.Category.Home,
    action: COAWebEvent.Action.clicked,
    object: 'SendMoney',
    description: 'Opened "send" page from home screen',
    objectType: OBJECT_TYPES.BUTTON,
  },
  sendMoneyButtonClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'SendMoney',
    description: 'Opened "send" page from payments screen',
    objectType: OBJECT_TYPES.BUTTON,
  },
  seeAllButtonClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'SeeAll',
    description: 'Opened "see all" page from payments screen',
    objectType: OBJECT_TYPES.BUTTON,
  },
  whoToPayPageOpened: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.opened,
    object: 'WhoToPayScreen',
    description: 'User opened WhoToPay screen',
    objectType: OBJECT_TYPES.PAGE,
  },
  addNewBeneficiaryButtonClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'WhoToPayNewAddBank',
    description: 'Clicked option to add new beneficiary',
    objectType: OBJECT_TYPES.BUTTON,
  },
  beneficiaryDetailsPageOpened: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.opened,
    object: 'BankBeneficiaryAccountDetails',
    description: 'Opened screen to add new beneficiary',
    objectType: OBJECT_TYPES.PAGE,
  },
  beneficiaryDetailsFormSubmitButtonClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'BankBeneficiaryAccountDetailsSubmit',
    description: 'Clicked continue after entering account details',
    objectType: OBJECT_TYPES.BUTTON,
  },
  beneficiaryAddressFormSubmitButtonClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'BankBeneficiaryRecipientAddressSubmit',
    description: 'Clicked continue after entering recipient address',
    objectType: OBJECT_TYPES.BUTTON,
  },
  beneficiaryAddInformationFormSubmitButtonClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'BankBeneficiaryRecipientAddInformationSubmit',
    description: 'Added information on bank beneficiary',
    objectType: OBJECT_TYPES.BUTTON,
  },
  transferAmountFormSubmitButtonClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'BankBeneficiaryRecipientContinue',
    description: 'Entered transfer amount',
    objectType: OBJECT_TYPES.BUTTON,
  },
  existingBeneficiaryItemClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'ExistingBankBeneficiary',
    description: 'Click existing beneficiary',
    objectType: OBJECT_TYPES.LIST_ITEM,
  },
  reviewTransferPageOpened: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.opened,
    object: 'BankBeneficiaryReviewTransfer',
    description: 'Review transfer',
    objectType: OBJECT_TYPES.PAGE,
  },
  reviewTransferFormSubmitButtonClicked: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.clicked,
    object: 'BankBeneficiaryReviewTransferSend',
    description: 'Send transfer',
    objectType: OBJECT_TYPES.BUTTON,
  },
  reviewTransferFormSubmitCompleted: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.completed,
    object: 'BankBeneficiaryReviewTransferSend',
    description: 'Send transfer',
    objectType: OBJECT_TYPES.DATA,
  },
  reviewTransferFormSubmitFailed: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.failed,
    object: 'BankBeneficiaryReviewTransferSend',
    description: 'Send transfer',
    objectType: OBJECT_TYPES.DATA,
  },
  twoFaPasscodePageOpened: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.opened,
    object: 'TwoFaPasscodeScreen',
    description: 'Tracks opening of passcode screen',
    objectType: OBJECT_TYPES.PAGE,
  },
  twoFaPasscodeSubmissionSucceeded: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.succeeded,
    object: 'TwoFaPasscodeScreen',
    description: 'Tracks successful passcode submit',
    objectType: OBJECT_TYPES.DATA,
  },
  twoFaPasscodeSubmissionFailed: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.failed,
    object: 'TwoFaPasscodeScreen',
    description: 'Tracks failed passcode submit',
    objectType: OBJECT_TYPES.DATA,
  },
  twoFaSmsSubmissionSucceeded: {
    category: COAWebEvent.Category.Payments,
    action: COAWebEvent.Action.succeeded,
    object: 'TwoFaSmsScreen',
    description: 'Tracks successful sms otp submit',
    objectType: OBJECT_TYPES.DATA,
  },
} as const

export const PaymentsTrackingEventParam = {
  WhoToPayPageSource: {
    HomeSend: 'HomeSend',
    PaymentsSend: 'PaymentsSend',
    PaymentsSeeAll: 'PaymentsSeeAll',
  },

  BeneficiaryFlow: {
    NewBeneficiaryAdded: 'NewBeneficiaryAdded',
    ExistingBeneficiary: 'ExistingBeneficiary',
  },

  BeneficiaryAccountType: {
    IndividualAccount: 'IndividualAccount',
    BusinessAccount: 'BusinessAccount',
  },
} as const

export const PaymentsTrackingEvent: Record<
  keyof typeof PAYMENTS_EVENTS,
  RetailEventOptions<string>
> = PAYMENTS_EVENTS
