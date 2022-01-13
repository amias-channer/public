import * as React from 'react'
import { Route, Switch } from 'react-router'

import { HeaderWrapper } from '../../components'
import { TabsEnum } from '../../constants/routerPaths'
import {
  useIsChatHeaderMinimized,
  useIsChatHeaderVisible,
} from '../../providers'

import { ChatHeader, HeaderTabs, RequestsHeader } from '.'

type HeaderProps = {
  isHelpExcluded: boolean
}

const Header = ({ isHelpExcluded }: HeaderProps) => {
  const isChatHeaderMinimized = useIsChatHeaderMinimized()
  const isChatHeaderVisible = useIsChatHeaderVisible()

  if (!isChatHeaderVisible) {
    return null
  }

  return (
    <HeaderWrapper elevation={isChatHeaderMinimized ? 100 : 0}>
      <Switch>
        <Route path={`${TabsEnum.CHAT}/:id`} component={ChatHeader} />
        <Route path={[TabsEnum.CHAT, TabsEnum.HELP]}>
          {isHelpExcluded ? <RequestsHeader /> : <HeaderTabs />}
        </Route>
      </Switch>
    </HeaderWrapper>
  )
}

export default Header
