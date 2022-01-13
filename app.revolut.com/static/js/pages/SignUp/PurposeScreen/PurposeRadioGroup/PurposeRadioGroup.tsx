import { Radio, RadioGroup, Text } from '@revolut/ui-kit'

import { FormFieldGenericPropsFC } from '@revolut/rwa-core-components'
import { UserAccountPurpose } from '@revolut/rwa-core-types'

import { useSignUpTranslation } from '../../hooks'
import { RadioElement } from './styled'

type Options = {
  text: string
  value: string
}

export const PurposeRadioGroup: FormFieldGenericPropsFC = ({ onChange }) => {
  const t = useSignUpTranslation()

  const options: Options[] = [
    {
      text: t('PurposeScreen.options.dailySpending'),
      value: UserAccountPurpose.DailySpending,
    },
    {
      text: t('PurposeScreen.options.travelSpending'),
      value: UserAccountPurpose.TravelSpending,
    },
    {
      text: t('PurposeScreen.options.moneyTransfer'),
      value: UserAccountPurpose.MoneyTransfer,
    },
    {
      text: t('PurposeScreen.options.trading'),
      value: UserAccountPurpose.Trading,
    },
  ]

  return (
    <RadioGroup onChange={onChange}>
      {(group) =>
        options.map((option) => (
          <RadioElement key={option.text} mb="px16">
            <Radio {...group.getInputProps({ value: option.value })}>
              <Text>{option.text}</Text>
            </Radio>
          </RadioElement>
        ))
      }
    </RadioGroup>
  )
}
