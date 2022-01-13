import { TFunction } from 'react-i18next'
import { OptionType } from '@revolut/ui-kit'

import { I18nNamespace } from 'utils'

import { SOWIncomeDestinationType } from '../../../../types/generated/sow'

export const getAccountOptions = (
  t: TFunction<typeof I18nNamespace.FormsAccountQuestion>,
) =>
  [
    {
      value: SOWIncomeDestinationType.Revolut,
      label: t('incomeDestination.revolut'),
    },
    {
      value: SOWIncomeDestinationType.External,
      label: t('incomeDestination.bank'),
    },
  ] as OptionType<SOWIncomeDestinationType>[]
