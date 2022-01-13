import { FC } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { FullAccessAuthRoute } from '@revolut/rwa-core-auth'
import { Url } from '@revolut/rwa-core-utils'

import { getCardsOverviewUrl } from '../helpers'
import { CardDeliveryUpdateRoute, CardOrderingRoute } from './ProtectedRoutes'
import { CardOtherSettingsScreen, CardSecurityScreen } from './CardsOverview'

export const CardsRouter: FC = () => (
  <Switch>
    <Redirect
      exact
      from={Url.Cards}
      to={{
        pathname: getCardsOverviewUrl(),
      }}
    />
    <Redirect
      exact
      from={Url.CardsOverview}
      to={{
        pathname: getCardsOverviewUrl(),
      }}
    />
    <Redirect
      exact
      from={Url.CardOverview}
      to={{
        pathname: getCardsOverviewUrl(),
      }}
    />
    <Route exact path={Url.CardSettingsSecurity} component={CardSecurityScreen} />
    <Route exact path={Url.CardSettingsOther} component={CardOtherSettingsScreen} />
    <FullAccessAuthRoute path={Url.CardOrdering} component={CardOrderingRoute} />
    <FullAccessAuthRoute
      exact
      path={Url.CardDeliveryUpdate}
      component={CardDeliveryUpdateRoute}
    />
    <Redirect
      exact
      from={Url.CardSettings}
      to={{
        pathname: getCardsOverviewUrl(),
      }}
    />
  </Switch>
)
