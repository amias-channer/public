import { FC } from 'react'
import { Switch } from 'react-router'
import { ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { FullAccessAuthRoute } from '@revolut/rwa-core-auth'
import { Url } from '@revolut/rwa-core-utils'

import {
  RedirectToRewardInstance,
  RewardDetails,
  RewardFeedback,
  RewardsGroup,
  RewardsHome,
} from './pages'

export const RewardsRouter: FC = () => (
  <ThemeProvider theme={UnifiedTheme}>
    <Switch>
      <FullAccessAuthRoute exact path={Url.RewardsHome} component={RewardsHome} />
      <FullAccessAuthRoute path={Url.RewardsGroup} component={RewardsGroup} />
      <FullAccessAuthRoute exact path={Url.RewardDetails} component={RewardDetails} />
      <FullAccessAuthRoute
        exact
        path={Url.RedirectToRewardInstance}
        component={RedirectToRewardInstance}
      />
      <FullAccessAuthRoute path={Url.RewardFeedback} component={RewardFeedback} />
    </Switch>
  </ThemeProvider>
)
