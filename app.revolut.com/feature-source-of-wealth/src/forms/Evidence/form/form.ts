import { ChangeEvent } from 'react'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType } from '@revolut/rwa-core-types'

import { FormSchemeComponent } from 'hooks'
import {
  SOWCreateEvidence,
  SOWEvidenceType,
  SOWCreateEvidenceCurrencyEnum,
} from '../../../types/generated/sow'

import { RadioSelect, TextInput, MoneyInput, TextArea } from '../../../components'
import { createOptions, getSubType } from '../../../utils'
import { IncomeSourceAddFormNames } from './constants'

const getEvidenceCurrencies = () => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  return Object.keys(SOWCreateEvidenceCurrencyEnum).map((key) => {
    return currencies[key]
  })
}

export const getIncomeSourceForm = (
  formValues: SOWCreateEvidence,
  handleFormChange: (
    field: IncomeSourceAddFormNames,
    value: any,
    shouldValidate?: boolean,
  ) => void,
  setValues: (values: SOWCreateEvidence, shouldValidate?: boolean) => void,
  evidenceTypes?: SOWEvidenceType[],
) => {
  const subType = getSubType(evidenceTypes, formValues.incomeSource)

  return {
    [IncomeSourceAddFormNames.IncomeSource]: {
      name: IncomeSourceAddFormNames.IncomeSource,
      Component: RadioSelect,
      props: {
        options: createOptions(evidenceTypes),
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          const foundSubType = getSubType(evidenceTypes, e.target.value)

          setValues({
            ...formValues,
            [IncomeSourceAddFormNames.IncomeSource]: e.target.value,
            [IncomeSourceAddFormNames.IncomeFrequency]:
              foundSubType?.defaultSubType?.type,
          } as SOWCreateEvidence)
        },
      },
    },
    [IncomeSourceAddFormNames.UserDescription]: {
      name: IncomeSourceAddFormNames.UserDescription,
      Component: TextInput,
    },
    [IncomeSourceAddFormNames.IncomeFrequency]: {
      name: IncomeSourceAddFormNames.IncomeFrequency,
      Component: RadioSelect,
      props: {
        options: createOptions(subType?.availableSubTypes),
      },
    },
    [IncomeSourceAddFormNames.MinorAmount]: {
      name: IncomeSourceAddFormNames.MinorAmount,
      Component: MoneyInput,
      props: {
        currencyOptions: getEvidenceCurrencies(),
        currency: formValues.currency,
        onChange: (value: string) => {
          handleFormChange(IncomeSourceAddFormNames.MinorAmount, value)
        },
        onCurrencyChange: (value: SOWCreateEvidenceCurrencyEnum) => {
          handleFormChange(IncomeSourceAddFormNames.Currency, value, false)
        },
      },
    },
    [IncomeSourceAddFormNames.UserNote]: {
      name: IncomeSourceAddFormNames.UserNote,
      Component: TextArea,
    },
  } as Record<IncomeSourceAddFormNames, FormSchemeComponent<IncomeSourceAddFormNames>>
}
