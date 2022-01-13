import { FC } from 'react'
import { Redirect } from 'react-router'
import { UnifiedTheme, ThemeProvider } from '@revolut/ui-kit'

import { FeatureKey } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { Url } from '@revolut/rwa-core-utils'

import { useCheckOriginalCardLimit } from '../../hooks'
import { CardOrderingRouter } from '../CardOrdering'

export const CardOrderingRoute: FC = () => {
  const { isFeatureActive } = useFeaturesConfig()
  const { isError: isCardLimitReached } = useCheckOriginalCardLimit()
  const isCardAddingAvailable =
    isFeatureActive(FeatureKey.AllowCardAdding) && !isCardLimitReached

  if (isCardAddingAvailable) {
    return (
      <ThemeProvider theme={UnifiedTheme}>
        <CardOrderingRouter />
      </ThemeProvider>
    )
  }

  return <Redirect to={Url.CardsOverview} />
}
