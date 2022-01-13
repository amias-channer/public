/* eslint-disable coherence/no-confusing-enum */
import React from 'react'
import { v4 as uuid } from 'uuid'

import {
  DateField,
  FieldType,
  MoneyField,
  PhoneField,
  TextField,
  FileField,
} from '../constants/form'

import { AccessRecoveryForm } from '../constants/accessRecovery'
import { DexterForm } from '../constants/dexter'
import {
  StructuredMessageClass,
  StructuredMessageContainer,
  StructuredMessageContainerType,
  StructuredMessageField,
  StructuredMessageFieldType,
} from '../constants/structuredMessage'
import countries from './countries'
import { SendChatEvent } from './types'
import { notReachable } from './utils'

const DEFAULT_CURRENCY = 'EUR'

type FormViewId = string
type FormatMessage = (ob: { id: string; defaultMessage: string }) => string

type FormStaticQuestion = {
  type: string
  required?: boolean
  subtitle?: string | React.ReactElement
  hint?: string | React.ReactElement
  title: string | (() => React.ReactElement) | React.ReactElement
  name: string
  value?: string | number
}

export type StaticForm = FormStaticQuestion[]

export type FormViewItem = {
  type: string
  id: string
  name?: string
  required?: boolean
  hint?: string | React.ReactElement
  value?: any
}
export type FormView = {
  id: FormViewId
  index: number
  type: string
  nextText: string
  next: Array<{
    id: string
  }>
  title?: React.ReactElement
  subtitle?: React.ReactElement
  items: FormViewItem[]
}

type Form = {
  id: string
  name: string
  version: string
  state: string
  views: Array<FormView>
  currentViewId?: FormViewId
}

enum FormState {
  Incomplete = 'INCOMPLETE',
  Complete = 'COMPLETE',
}

type FormField = TextField | PhoneField | DateField | MoneyField | FileField

type PrefillOptions = { locale: string }

const getCurrentStep = (form: Form) =>
  form.views.find((view) => view.id === form.currentViewId)

export const getFormNextStep = (form: Form) => {
  const currentElement = getCurrentStep(form)
  if (!currentElement) {
    return null
  }

  return currentElement.next.length && currentElement.next[0].id
}

const getUserCurrency = (locale: string) => {
  const country = locale.split('-')
  const countryIndex =
    country.length > 1 ? country[1].toLocaleUpperCase() : 'GB'
  if (Object.prototype.hasOwnProperty.call(countries, countryIndex)) {
    return countries[countryIndex as keyof typeof countries].currencyCode
  }
  return DEFAULT_CURRENCY
}

const getFormCurrencies = () => {
  const currencyCodes = Object.values(countries).map(
    (country) => country.currencyCode
  )
  return [...new Set(currencyCodes)].filter(Boolean).sort()
}

const prefillQuestion = (views: FormViewItem[], { locale }: PrefillOptions) => {
  return views.map((item) => {
    if (!item.value && item.type === FieldType.MoneyInput) {
      return {
        ...item,
        value: { currency: getUserCurrency(locale), amount: null },
      }
    }
    return item
  })
}

export const getQuestionViews = (
  question: FormStaticQuestion,
  formatMessage: FormatMessage
) => {
  const base = {
    name: question.name,
    type: question.type,
    id: uuid(),
    required: question.required,
  }
  switch (question.type) {
    case FieldType.MoneyInput:
      return [
        {
          ...base,
          hint: question.hint,
          ...(question.type === FieldType.MoneyInput
            ? { currencies: getFormCurrencies() }
            : {}),
        },
      ]

    case FieldType.FilesUpload:
      return [
        {
          ...base,
          buttonTitle: formatMessage({
            id: 'supportChat.form.upload',
            defaultMessage: 'Upload',
          }),
          captureHint: formatMessage({
            id: 'supportChat.form.capture',
            defaultMessage: 'Capture',
          }),
          confirmPhotoHint: formatMessage({
            id: 'supportChat.form.confirm',
            defaultMessage: 'Confirm',
          }),
          retakePhotoHint: formatMessage({
            id: 'supportChat.form.retakePhoto',
            defaultMessage: 'Re-take photo',
          }),
          switchCameraHint: formatMessage({
            id: 'supportChat.form.switchCamera',
            defaultMessage: 'Switch camera',
          }),
          takePhotoHint: formatMessage({
            id: 'supportChat.form.takePhoto',
            defaultMessage: 'Take photo',
          }),
        },
      ]
    default:
      return [
        {
          ...base,
          name: question.name,
          type: question.type,
          id: uuid(),
          required: question.required,
          hint: question.hint,
          ...(question.value
            ? {
                value: {
                  value: question.value,
                },
              }
            : {}),
        },
      ]
  }
}

export const prepareStaticForm = (
  id: string,
  staticForm: StaticForm,
  locale: string,
  formatMessage: FormatMessage
) => {
  let nextElementId = uuid()

  const views = staticForm.map((question, index) => {
    const currentId = nextElementId
    nextElementId = uuid()
    return {
      type: 'FORM',
      id: currentId,
      index,
      nextText: formatMessage({
        id: 'supportChat.accessRecovery.continue',
        defaultMessage: 'Continue',
      }),
      next:
        index < staticForm.length - 1
          ? [
              {
                id: nextElementId,
              },
            ]
          : [],
      title: question.title,
      subtitle: question.subtitle,
      items: prefillQuestion(getQuestionViews(question, formatMessage), {
        locale,
      }),
    }
  })

  return {
    id,
    name: 'StaticForm',
    version: '1',
    state: FormState.Incomplete,
    views,
    currentViewId: views[0].id,
  }
}

export const getValuesFromStaticForm = (views: FormView[]) =>
  views.reduce(
    (results, view) => ({
      ...results,
      ...view.items.reduce(
        (acc, viewElement) =>
          viewElement.name
            ? {
                ...acc,
                [viewElement.name]: {
                  type: viewElement.type,
                  value: viewElement.value,
                },
              }
            : acc,
        {}
      ),
    }),
    {}
  )

type StaticFormProps = {
  id: string
  form: StaticForm
  locale: string
  formatMessage: FormatMessage
  onFileUpload: (id: string, file: File) => void
  sendChatEvent?: SendChatEvent
}

export const getStaticFormsAPI = ({
  id,
  form,
  locale,
  sendChatEvent,
  formatMessage,
  onFileUpload,
}: StaticFormProps) => ({
  loadFlow: () =>
    Promise.resolve(prepareStaticForm(id, form, locale, formatMessage)),
  submitFlow: async (staticForm: Form) => {
    const currentElement = getCurrentStep(staticForm)
    if (sendChatEvent) {
      sendChatEvent({
        type: 'AccessRecoveryStep',
        params: {
          step: currentElement?.index,
        },
      })
    }

    const nextStep = getFormNextStep(staticForm)
    if (!nextStep) {
      if (sendChatEvent) {
        sendChatEvent({
          type: 'AccessRecoverySubmit',
        })
      }
      return {
        id: staticForm.id,
        response: staticForm.views,
      }
    }

    const result = {
      ...staticForm,
      state: nextStep ? FormState.Incomplete : FormState.Complete,
      ...(nextStep ? { currentViewId: nextStep } : {}),
    }
    return result
  },
  uploadFile: async (file: File) => {
    const fileId = uuid()
    onFileUpload(fileId, file)

    return Promise.resolve({ id: fileId })
  },
})

const fieldToStructuredMessage = (
  field: FormField
): StructuredMessageField[] => {
  switch (field.type) {
    case FieldType.TextInput:
      return [
        {
          type: StructuredMessageFieldType.TEXT,
          value: field.value?.value || '',
        },
      ]
    case FieldType.DateInput:
      return [
        {
          type: StructuredMessageFieldType.DATE,
          value: field.value?.value || '',
        },
      ]
    case FieldType.MoneyInput:
      return [
        {
          type: StructuredMessageFieldType.MONEY,
          amount: field.value?.amount ? Number(field.value.amount) : 0,
          currency: field.value?.currency || '',
        },
      ]
    case FieldType.PhoneInput:
      return [
        {
          type: StructuredMessageFieldType.PHONE,
          value: field.value?.number
            ? `${field.value.code}${field.value.number}`
            : '',
        },
      ]
    case FieldType.FilesUpload:
      return field.value?.files.map((file) => ({
        type: StructuredMessageFieldType.FILE,
        id: file.id,
        filename: file.source.name,
        mediaType: file.source.type,
      }))
    default:
      return notReachable(field)
  }
}

export const createStructuredMessage = (
  form: AccessRecoveryForm | DexterForm,
  getFormFieldTitle: (field: string) => string
): StructuredMessageContainer => {
  const content: StructuredMessageContainer[] = Object.entries(form).map(
    ([name, field]) => {
      const structuredFields = fieldToStructuredMessage(
        (field as unknown) as FormField
      )
      const elements = structuredFields.map((element) => ({
        ...element,
        classes: [StructuredMessageClass.BOLD],
      }))

      return {
        type: StructuredMessageContainerType.VBOX,
        content: [
          {
            type: StructuredMessageFieldType.TEXT,
            value: getFormFieldTitle(name as string),
            classes: [StructuredMessageClass.HEADING_3],
          },
          ...elements,
        ],
      }
    }
  )

  return {
    type: StructuredMessageContainerType.VBOX,
    content,
    spacing: {
      value: 0.5,
      unit: 'rem',
    },
  }
}
