import { FC } from 'react'
import { Details } from '@revolut/ui-kit'

import { CheckoutItemTestId } from './constants'
import { OriginalDiscountedFee } from './styled'

export type CheckoutItemProps = {
  title: string
  fee: string
  discountFee?: string
}

export const CheckoutItem: FC<CheckoutItemProps> = ({ title, fee, discountFee }) => (
  <Details>
    <Details.Title>{title}</Details.Title>
    <Details.Content>
      {discountFee && (
        <OriginalDiscountedFee data-testid={CheckoutItemTestId.OriginalDiscountedFee}>
          {fee}
        </OriginalDiscountedFee>
      )}
      {discountFee ?? fee}
    </Details.Content>
  </Details>
)
