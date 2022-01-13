import { FC } from 'react'
import { Box, Text } from '@revolut/ui-kit'

import { useCommonTranslation } from 'hooks'

import { PendingCardPaymentAction } from './PendingCardPaymentAction'

export const PendingActions: FC = () => {
  const t = useCommonTranslation()

  return (
    <Box>
      <Text color="accountsPendingActionsTitle" mb={2}>
        {t('actions')}
      </Text>
      <PendingCardPaymentAction />
    </Box>
  )
}
