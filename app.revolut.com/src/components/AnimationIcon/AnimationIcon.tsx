import React from 'react'
import axios from 'axios'
import { Animation, AnimationJSON, AnimationProps } from '@revolut/ui-kit'

const request = (src: string) =>
  axios.get<AnimationJSON>(src).then((response) => response.data)

export const ANIMATIONS = [
  'accounts',
  'adminUpdate',
  'attention',
  'business',
  'businessConnect',
  'captureReceipts',
  'card',
  'checkmark',
  'clock',
  'coverLoan',
  'cross',
  'customDocuments',
  'declined',
  'directDebitPromo',
  'directDebitPromoBig',
  'document',
  'documentLarge',
  'documentXLarge',
  'drone',
  'easyApplication',
  'emailVerification',
  'expenseManagementCover',
  'expensesExport',
  'forSignup',
  'graph',
  'hedgingHowItWorks',
  'identity',
  'indevelopment',
  'invoicePromoBanner',
  'invoicesIntro1',
  'invoicesIntro2',
  'invoicesIntro3',
  'invoicesToast',
  'kyc',
  'languagePromo',
  'laptopLarge',
  'lock',
  'medicalInsurance',
  'merchantAllInOnePuzzle',
  'merchantMultiCurrency',
  'merchantSettlementTimer',
  'merchantSetupDocCoffee',
  'merchantWaitingListPromo',
  'multiAccountsPromo',
  'multiAccountsPromoBig',
  'nature',
  'no-rules',
  'noFeesOrCharges',
  'openBankingAccounts',
  'operations',
  'payroll',
  'payrollIntro1',
  'payrollIntro2',
  'payrollIntro3',
  'payrollIntro4',
  'payrollToast',
  'perks',
  'personal',
  'physicalCard',
  'pricing',
  'purchase',
  'receiptsChasing',
  'recurringPayments',
  'referABusiness',
  'request',
  'reviewApproveRefund',
  'revolutPlanet',
  'signature',
  'signatureLarge',
  'signatureNew',
  'signaturePromo',
  'signin',
  'signInLaptop',
  'signup',
  'smsVerification',
  'sourceOfFunds',
  'spaceman',
  'structureDirector',
  'structureMain',
  'structureOwner',
  'subscriptions',
  'subscriptionsToast',
  'survey',
  'transaction',
  'trash',
  'unsupportedCountry',
  'unsupportedLegalType',
  'upgrade',
  'useplus',
  'user',
  'usersLimit',
  'usersLimitBig',
  'usWaitlist',
  'verify',
  'virtualCard',
  'waiting',
  'xeroIntergrate',
  'xeroTemplate',
] as const

export type AnimationName = typeof ANIMATIONS[number]

type BaseProps = Omit<AnimationProps, 'ref' | 'src'>

interface Props extends BaseProps {
  name: AnimationName
}

export const AnimationIcon = ({ name, ...rest }: Props) => (
  <Animation
    request={request}
    src={`https://assets.revolut.com/animations/${name}.json`}
    {...rest}
  />
)
