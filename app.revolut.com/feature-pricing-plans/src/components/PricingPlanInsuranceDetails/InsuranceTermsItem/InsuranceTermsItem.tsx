import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, Item, TextButton } from '@revolut/ui-kit'

import { I18_NAMESPACE } from '../../../constants'

enum InsuranceTermsItemId {
  TermsAndConditions = 'insurance-terms-conditions',
}

type InsuranceTermsItemProps = {
  onAcceptedChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onTermsButtonClick: VoidFunction
}

export const InsuranceTermsItem: FC<InsuranceTermsItemProps> = ({
  onAcceptedChange,
  onTermsButtonClick,
}) => {
  const { t } = useTranslation(I18_NAMESPACE)

  return (
    <Item use="label">
      <Item.Prefix>
        <Checkbox
          aria-labelledby={InsuranceTermsItemId.TermsAndConditions}
          onChange={onAcceptedChange}
        />
      </Item.Prefix>
      <Item.Content>
        <Item.Title id={InsuranceTermsItemId.TermsAndConditions}>
          {t('PricingPlanInsuranceDetails.InsuranceTermsItem.text')}{' '}
          <TextButton onClick={onTermsButtonClick}>
            {t('PricingPlanInsuranceDetails.InsuranceTermsItem.linkText')}
          </TextButton>
        </Item.Title>
      </Item.Content>
    </Item>
  )
}
