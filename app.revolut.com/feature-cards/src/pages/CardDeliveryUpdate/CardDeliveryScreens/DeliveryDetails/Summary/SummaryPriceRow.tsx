import { FC } from 'react'
import { Media, TextBox } from '@revolut/ui-kit'

type SummaryPriceRowProps = {
  title: string
  price: string
}

export const SummaryPriceRow: FC<SummaryPriceRowProps> = ({ title, price }) => (
  <Media>
    <Media.Content alignSelf="center">
      <TextBox color="cardOrderingSummaryRowTitle">{title}</TextBox>
    </Media.Content>
    <Media.Side>
      <TextBox>{price}</TextBox>
    </Media.Side>
  </Media>
)
