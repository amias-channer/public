import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { TabBar, Text } from '@revolut/ui-kit'

import { TabsEnum } from '../../constants/routerPaths'
import { ChatHeaderContext, useIsAccessRecovery } from '../../providers'

const TabBarItemText: React.FC = ({ children }) => (
  <Text variant='secondary' fontWeight={500}>
    {children}
  </Text>
)

export const HeaderTabs = () => {
  const { setIsChatHeaderMinimized } = useContext(ChatHeaderContext)
  setIsChatHeaderMinimized(true)
  const isAccessRecoveryMode = useIsAccessRecovery()
  const chatPath = isAccessRecoveryMode
    ? TabsEnum.ACCESS_RECOVERY
    : TabsEnum.CHAT
  return (
    <TabBar>
      <TabBar.Item to={TabsEnum.HELP}>
        <FormattedMessage
          id='supportChat.tab.helpCentre'
          defaultMessage='Help centre'
          tagName={TabBarItemText}
        />
      </TabBar.Item>
      <TabBar.Item to={chatPath}>
        <FormattedMessage
          id='supportChat.tab.requests'
          defaultMessage='Requests'
          tagName={TabBarItemText}
        />
      </TabBar.Item>
    </TabBar>
  )
}
