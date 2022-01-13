import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Checkbox, CheckboxGroup, Group, Subheader, Text } from '@revolut/ui-kit'

import { PlanInsuranceReviewDetailsConditionDto } from '@revolut/rwa-core-types'

import { I18_NAMESPACE } from '../../../constants'

type PolicyConditionsProps = {
  conditions: PlanInsuranceReviewDetailsConditionDto[]
  onAcceptedChange: (value: string[]) => void
}

export const PolicyConditions: FC<PolicyConditionsProps> = ({
  conditions,
  onAcceptedChange,
}) => {
  const { t } = useTranslation(I18_NAMESPACE)

  return (
    <>
      <Subheader>
        <Subheader.Title>
          {t('PricingPlanInsuranceDetails.PolicyConditions.title')}
        </Subheader.Title>
      </Subheader>
      <CheckboxGroup onChange={(value: string[]) => onAcceptedChange(value)}>
        {(group) => (
          <Group>
            {conditions.map((condition) => (
              <Cell key={condition.name}>
                <Checkbox {...group.getInputProps({ value: condition.name })}>
                  <Text>{condition.value}</Text>
                </Checkbox>
              </Cell>
            ))}
          </Group>
        )}
      </CheckboxGroup>
    </>
  )
}
