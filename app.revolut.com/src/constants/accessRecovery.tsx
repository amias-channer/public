/* eslint-disable coherence/no-confusing-enum */
import React from 'react'
import { Box } from '@revolut/ui-kit'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import {
  DateField,
  FieldType,
  FileField,
  MoneyField,
  PhoneField,
  TextField,
} from './form'

export enum AccessRecoveryFormField {
  INITIAL_STEP = 'initialStep',
  NAME = 'name',
  COMPANY_NAME = 'companyName',
  EMAIL_ADDRESS = 'emailAddress',
  PHONE_NUMBER = 'phoneNumber',
  PERSONAL_ADDRESS = 'personalAddress',
  BUSINESS_ADDRESS = 'businessAddress',
  DATE_OF_BIRTH = 'dateOfBirth',
  TRANSACTION_VALUE = 'transactionValue',
  DESCRIPTION = 'description',
  PHOTO_FILES = 'photoFiles',
}

export const ACCESS_RECOVERY_CDN_IMAGE =
  'business/illustrations-repository/shield-with-coin@2x.png'

export const ACCESS_RECOVERY_CDN_ALERT_IMAGE =
  'business/illustrations-repository/error-state-red@2x.png'

export const ACCESS_RECOVERY_TITLE_KEY =
  'form.business.title.recover-access-to-your-account'

export type AccessRecoveryForm = {
  [AccessRecoveryFormField.NAME]: TextField
  [AccessRecoveryFormField.COMPANY_NAME]: TextField
  [AccessRecoveryFormField.EMAIL_ADDRESS]: TextField
  [AccessRecoveryFormField.PHONE_NUMBER]: PhoneField
  [AccessRecoveryFormField.PERSONAL_ADDRESS]: TextField
  [AccessRecoveryFormField.BUSINESS_ADDRESS]: TextField
  [AccessRecoveryFormField.DATE_OF_BIRTH]: DateField
  [AccessRecoveryFormField.TRANSACTION_VALUE]: MoneyField
  [AccessRecoveryFormField.DESCRIPTION]: TextField
  [AccessRecoveryFormField.PHOTO_FILES]: FileField
}

const accessRecoveryFormFieldTitle = defineMessages({
  [AccessRecoveryFormField.NAME]: {
    id: 'supportChat.accessRecovery.name.title',
    defaultMessage: "What's your full name?",
  },
  [AccessRecoveryFormField.COMPANY_NAME]: {
    id: 'supportChat.accessRecovery.company.title',
    defaultMessage: "What's your company's name?",
  },
  [AccessRecoveryFormField.EMAIL_ADDRESS]: {
    id: 'supportChat.accessRecovery.emailAddress.title',
    defaultMessage: 'What was the email used for sign-up?',
  },
  [AccessRecoveryFormField.PHONE_NUMBER]: {
    id: 'supportChat.accessRecovery.phoneNumber.title',
    defaultMessage: 'What is the phone number linked to your account?',
  },
  [AccessRecoveryFormField.PERSONAL_ADDRESS]: {
    id: 'supportChat.accessRecovery.personalAddress.title',
    defaultMessage: 'What is your personal address?',
  },
  [AccessRecoveryFormField.BUSINESS_ADDRESS]: {
    id: 'supportChat.accessRecovery.businessAddress.title',
    defaultMessage: 'What is your business address?',
  },
  [AccessRecoveryFormField.DATE_OF_BIRTH]: {
    id: 'supportChat.accessRecovery.dateOfBirth.title',
    defaultMessage: 'What is your date of birth?',
  },
  [AccessRecoveryFormField.TRANSACTION_VALUE]: {
    id: 'supportChat.accessRecovery.transactionValue.title',
    defaultMessage: 'What was your last top-up amount?',
  },
  [AccessRecoveryFormField.DESCRIPTION]: {
    id: 'supportChat.accessRecovery.whereIssue.title',
    defaultMessage: 'Where did the issue occur?',
  },
  [AccessRecoveryFormField.PHOTO_FILES]: {
    id: 'supportChat.accessRecovery.photoWithId.title',
    defaultMessage: 'Submit a selfie holding your ID',
  },
})

export const useAccessRecoveryFormFieldTitle = () => {
  const { formatMessage } = useIntl()

  return {
    getAccessRecoveryFormFieldTitle: (formField: AccessRecoveryFormField) =>
      accessRecoveryFormFieldTitle[formField]
        ? formatMessage(accessRecoveryFormFieldTitle[formField])
        : '',
  }
}

export const getAccessRecoveryFormRaw = (
  getAccessRecoveryFormFieldTitle: (field: AccessRecoveryFormField) => string,
  formatMessage: ReturnType<typeof useIntl>['formatMessage']
) => [
  {
    title: getAccessRecoveryFormFieldTitle(AccessRecoveryFormField.NAME),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.name.subtitle'
        defaultMessage='Please provide your full name as it appears in your ID.'
      />
    ),
    type: FieldType.TextInput,
    required: true,
    hint: formatMessage({
      id: 'supportChat.accessRecovery.name.hint',
      defaultMessage: 'Full name',
    }),
    name: AccessRecoveryFormField.NAME,
  },
  {
    title: getAccessRecoveryFormFieldTitle(
      AccessRecoveryFormField.COMPANY_NAME
    ),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.company.subtitle'
        defaultMessage='Please provide the company name for which you’re trying to login.'
      />
    ),
    type: FieldType.TextInput,
    required: true,
    hint: formatMessage({
      id: 'supportChat.accessRecovery.company.hint',
      defaultMessage: 'Company name',
    }),
    name: AccessRecoveryFormField.COMPANY_NAME,
  },
  {
    title: getAccessRecoveryFormFieldTitle(
      AccessRecoveryFormField.EMAIL_ADDRESS
    ),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.emailAddress.subtitle'
        defaultMessage='Please provide your account’s e-mail.'
      />
    ),
    type: FieldType.TextInput,
    required: true,
    hint: formatMessage({
      id: 'supportChat.accessRecovery.emailAddress.hint',
      defaultMessage: 'E-mail',
    }),
    name: AccessRecoveryFormField.EMAIL_ADDRESS,
  },
  {
    title: getAccessRecoveryFormFieldTitle(
      AccessRecoveryFormField.PHONE_NUMBER
    ),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.phoneNumber.subtitle'
        defaultMessage='Please provide your account’s phone number.'
      />
    ),
    type: FieldType.PhoneInput,
    required: true,
    hint: formatMessage({
      id: 'supportChat.accessRecovery.phoneNumber.hint',
      defaultMessage: 'Mobile number',
    }),
    name: AccessRecoveryFormField.PHONE_NUMBER,
  },
  {
    title: getAccessRecoveryFormFieldTitle(
      AccessRecoveryFormField.PERSONAL_ADDRESS
    ),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.personalAddress.subtitle'
        defaultMessage='Please provide the home address associated with your account currently.'
      />
    ),
    type: FieldType.TextInput,
    required: true,
    hint: formatMessage({
      id: 'supportChat.accessRecovery.personalAddress.hint',
      defaultMessage: 'Address',
    }),
    name: AccessRecoveryFormField.PERSONAL_ADDRESS,
  },
  {
    title: getAccessRecoveryFormFieldTitle(
      AccessRecoveryFormField.BUSINESS_ADDRESS
    ),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.businessAddress.subtitle'
        defaultMessage='Please provide the registered address associated with your account currently.'
      />
    ),
    type: FieldType.TextInput,
    required: true,
    hint: formatMessage({
      id: 'supportChat.accessRecovery.businessAddress.hint',
      defaultMessage: 'Address',
    }),
    name: AccessRecoveryFormField.BUSINESS_ADDRESS,
  },
  {
    title: getAccessRecoveryFormFieldTitle(
      AccessRecoveryFormField.DATE_OF_BIRTH
    ),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.dateOfBirth.subtitle'
        defaultMessage='Please provide your date of birth as it appears in your ID.'
      />
    ),
    type: FieldType.TextInput,
    required: true,
    hint: `${formatMessage({
      id: 'supportChat.accessRecovery.dateOfBirth.hint',
      defaultMessage: 'Birth date',
    })} (DD-MM-YYYY)`,
    name: AccessRecoveryFormField.DATE_OF_BIRTH,
  },
  {
    title: getAccessRecoveryFormFieldTitle(
      AccessRecoveryFormField.TRANSACTION_VALUE
    ),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.transactionValue.subtitle'
        defaultMessage='Please provide your last inbound transfer amount.'
      />
    ),
    type: FieldType.MoneyInput,
    required: true,
    hint: formatMessage({
      id: 'supportChat.accessRecovery.transactionValue.hint',
      defaultMessage: 'Amount',
    }),
    name: AccessRecoveryFormField.TRANSACTION_VALUE,
  },
  {
    title: getAccessRecoveryFormFieldTitle(AccessRecoveryFormField.DESCRIPTION),
    subtitle: (
      <FormattedMessage
        id='supportChat.accessRecovery.description.subtitle'
        defaultMessage='Please describe your problem with login to help us understand how we can help.'
      />
    ),
    type: FieldType.TextInput,
    required: true,
    hint: formatMessage({
      id: 'supportChat.accessRecovery.description.hint',
      defaultMessage: 'Description',
    }),
    name: AccessRecoveryFormField.DESCRIPTION,
  },
  {
    title: getAccessRecoveryFormFieldTitle(AccessRecoveryFormField.PHOTO_FILES),
    subtitle: (
      <>
        <FormattedMessage
          id='supportChat.accessRecovery.photoWithId.subtitle'
          defaultMessage='Please ensure your face and the front of your ID are visible in the photo.'
        />
        <Box mt={1} mb={-1}>
          <FormattedMessage
            id='supportChat.accessRecovery.photoWithId.subtitleIfNoPhoto'
            defaultMessage='If you don’t have a camera on your computer, please hold up a paper with today’s date and use the upload functionality.'
          />
        </Box>
      </>
    ),
    type: FieldType.FilesUpload,
    required: true,
    name: AccessRecoveryFormField.PHOTO_FILES,
  },
]
