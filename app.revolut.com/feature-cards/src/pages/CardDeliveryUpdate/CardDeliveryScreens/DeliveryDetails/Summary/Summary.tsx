import { FC } from 'react'
import { Box, Card, TextBox } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'

import { useCardsTranslation } from '../../../../../hooks'
import { SummaryPriceRow } from './SummaryPriceRow'

type SummaryProps = {
  cardPrice: string
  totalPrice: string
}

export const Summary: FC<SummaryProps> = ({ cardPrice, totalPrice }) => {
  const t = useCardsTranslation()

  return (
    <Box mt="px32">
      <TextBox color="cardDeliveryDetailsSummaryTitle" fontSize="smaller">
        {t('CardOrdering.DeliveryDetailsScreen.summary.title')}
      </TextBox>
      <Spacer h="px16" />
      <Card py={{ _: 'px16', md: 'px24' }} px={{ _: 'px24', md: 'px32' }}>
        <SummaryPriceRow
          title={t('CardOrdering.DeliveryDetailsScreen.summary.extraFee')}
          price={cardPrice}
        />
        <Spacer h="px16" />
        <SummaryPriceRow
          title={t('CardOrdering.DeliveryDetailsScreen.summary.total')}
          price={totalPrice}
        />
      </Card>
    </Box>
  )
}
