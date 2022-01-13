/* eslint-disable coherence/no-confusing-enum */
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { StaticForm } from '../helpers/forms'
import { FieldType } from './form'

export enum DexterFormField {
  DESCRIPTION = 'Description',
}

export type DexterForm = {
  [DexterFormField.DESCRIPTION]: {
    type: FieldType.TextInput
    value: {
      value: string
    }
  }
}

export const getRawFormFlow = (
  description: string | null,
  formatMessage: ReturnType<typeof useIntl>['formatMessage']
) =>
  [
    {
      title: (
        <FormattedMessage
          id='supportChat.dexter.description.title'
          defaultMessage='How can we help?'
        />
      ),
      subtitle: (
        <FormattedMessage
          id='supportChat.dexter.description.subtitle'
          defaultMessage='Please provide a short description of the issue you’re facing.We’ll help you solve it as quickly as possible'
        />
      ),
      type: FieldType.TextInput,
      required: true,
      hint: formatMessage({
        id: 'supportChat.dexter.description.hint',
        defaultMessage: 'Description',
      }),
      name: DexterFormField.DESCRIPTION,
      value: description,
    },
  ] as StaticForm
