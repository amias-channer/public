import { TFunction } from 'react-i18next'
import * as Yup from 'yup'

import { I18nNamespace } from 'utils'

import { IncomeSourceAddFormNames, isOtherIncomeSource } from './constants'

export const getIncomeSourceValidation = (t: TFunction<typeof I18nNamespace.Common>) =>
  Yup.object({
    [IncomeSourceAddFormNames.IncomeSource]: Yup.string().required(),
    [IncomeSourceAddFormNames.UserDescription]: Yup.string().when(
      IncomeSourceAddFormNames.IncomeSource,
      {
        is: isOtherIncomeSource,
        then: Yup.string().required(t('requiredField')),
      },
    ),
    [IncomeSourceAddFormNames.IncomeFrequency]: Yup.string().required(),
    [IncomeSourceAddFormNames.MinorAmount]: Yup.number().required(t('requiredField')),
    [IncomeSourceAddFormNames.UserNote]: Yup.string(),
  })
