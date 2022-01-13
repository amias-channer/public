import { FC } from 'react'
import { Route, Switch } from 'react-router'

import { Url } from '@revolut/rwa-core-utils'

import { ChangePasscode } from './ChangePasscode'
import { ChangePhoneNumber } from './ChangePhoneNumber'
import { PersonalDetails } from './PersonalDetails'
import { SettingsPage } from './SettingsPage'

export const SettingsRouter: FC = () => (
  <Switch>
    <Route exact path={Url.Settings} component={SettingsPage} />
    <Route exact path={Url.ChangePasscode} component={ChangePasscode} />
    <Route exact path={Url.ChangePhoneNumber} component={ChangePhoneNumber} />
    <Route exact path={Url.PersonalDetails} component={PersonalDetails} />
  </Switch>
)
