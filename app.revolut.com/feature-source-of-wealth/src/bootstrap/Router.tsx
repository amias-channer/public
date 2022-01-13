import { FC } from 'react'
import { Switch, Route } from 'react-router'

import { Overview, Verify, IncomeSource } from '../pages'
import { Url } from '../utils'
import { SotOverview } from '../pages/SotOverview/SotOverview'

export const Router: FC = () => {
  return (
    <Switch>
      <Route exact path={Url.SotVerification} component={SotOverview} />
      <Route exact path={Url.SowVerification} component={Overview} />
      <Route path={Url.SowVerificationVerify} component={Verify} />

      {/* Forms */}
      <Route path={Url.SowVerificationFormIncomeSource} component={IncomeSource} />
    </Switch>
  )
}
