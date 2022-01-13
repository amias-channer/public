import { TFunction } from 'react-i18next'

import { FormInfo } from 'hooks'
import { I18nNamespace } from 'utils'

import { FormStateAction } from '../../../hooks'
import {
  SOWEvidenceTypeType,
  SOWCreateEvidenceCurrencyEnum,
} from '../../../types/generated/sow'

export enum IncomeSourceAddFormNames {
  IncomeSource = 'incomeSource',
  UserDescription = 'userDescription',
  IncomeFrequency = 'incomeFrequency',
  MinorAmount = 'minorAmount',
  Currency = 'currency',
  UserNote = 'userNote',
}

export const getIncomeSourceInfo = (t: TFunction<typeof I18nNamespace.FormsEvidence>) =>
  ({
    [IncomeSourceAddFormNames.IncomeSource]: {
      title: t('incomeSource.title'),
      description: t('incomeSource.description'),
      label: t('incomeSource.label'),
    },
    [IncomeSourceAddFormNames.UserDescription]: {
      title: t('userDescription.title'),
      description: t('userDescription.description'),
      label: t('userDescription.label'),
    },
    [IncomeSourceAddFormNames.IncomeFrequency]: {
      title: t('frequency.title'),
      description: t('frequency.description'),
      label: t('frequency.label'),
    },
    [IncomeSourceAddFormNames.MinorAmount]: {
      title: t('amount.title'),
      description: t('amount.description'),
    },
    [IncomeSourceAddFormNames.UserNote]: {
      title: t('note.title'),
      description: t('note.description'),
      isLast: true,
    },
  } as FormInfo<IncomeSourceAddFormNames>)

export const incomeSourceFormState = {
  initialState: IncomeSourceAddFormNames.IncomeSource,
  states: {
    [IncomeSourceAddFormNames.IncomeSource]: {
      actions: {
        [FormStateAction.Forward]: {
          target: IncomeSourceAddFormNames.IncomeFrequency,
        },
        [FormStateAction.Additional]: {
          target: IncomeSourceAddFormNames.UserDescription,
        },
      },
    },
    [IncomeSourceAddFormNames.UserDescription]: {
      actions: {
        [FormStateAction.Forward]: {
          target: IncomeSourceAddFormNames.IncomeFrequency,
        },
        [FormStateAction.Back]: {
          target: IncomeSourceAddFormNames.IncomeSource,
        },
      },
    },
    [IncomeSourceAddFormNames.IncomeFrequency]: {
      actions: {
        [FormStateAction.Forward]: {
          target: IncomeSourceAddFormNames.MinorAmount,
        },
        [FormStateAction.Back]: {
          target: IncomeSourceAddFormNames.IncomeSource,
        },
      },
    },
    [IncomeSourceAddFormNames.MinorAmount]: {
      actions: {
        [FormStateAction.Forward]: {
          target: IncomeSourceAddFormNames.UserNote,
        },
        [FormStateAction.Back]: {
          target: IncomeSourceAddFormNames.IncomeFrequency,
        },
      },
    },
    [IncomeSourceAddFormNames.UserNote]: {
      actions: {
        [FormStateAction.Back]: {
          target: IncomeSourceAddFormNames.MinorAmount,
        },
      },
    },
  },
}

export const isOtherIncomeSource = (incomeSource: SOWEvidenceTypeType) =>
  incomeSource === SOWEvidenceTypeType.Other

export const incomeSourceInitialValues = {
  [IncomeSourceAddFormNames.Currency]: SOWCreateEvidenceCurrencyEnum.GBP,
  [IncomeSourceAddFormNames.UserNote]: '',
  [IncomeSourceAddFormNames.MinorAmount]: 0,
}
