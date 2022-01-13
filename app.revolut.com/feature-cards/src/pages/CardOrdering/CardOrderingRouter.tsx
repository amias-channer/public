import { FC } from 'react'
import { Route, Switch } from 'react-router'

import { Url } from '@revolut/rwa-core-utils'

import { CardOrderCheckout } from './CardOrderCheckout'
import { CardTypeSelectionScreen } from './CardTypeSelectionScreen'
import { PhysicalCardsOrderingRoute } from './physical/PhysicalCardsOrderingRoute'
import { VirtualCardSelectionScreen } from './virtual/VirtualCardSelectionScreen'

export const CardOrderingRouter: FC = () => {
  return (
    <Switch>
      <Route exact path={Url.CardOrderingDebit} component={PhysicalCardsOrderingRoute} />
      <Route
        exact
        path={Url.CardOrderingVirtual}
        component={VirtualCardSelectionScreen}
      />
      <Route exact path={Url.CardOrderingCheckout} component={CardOrderCheckout} />
      <Route exact path={Url.CardOrdering} component={CardTypeSelectionScreen} />
    </Switch>
  )
}
