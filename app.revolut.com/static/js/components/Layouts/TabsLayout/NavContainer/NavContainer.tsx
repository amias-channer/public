import { FC } from 'react'
import { TabBar } from '@revolut/ui-kit'

import { TabsLayoutProps } from '../types'
import { Container } from './styled'

type NavContainer = Pick<TabsLayoutProps, 'tabs' | 'onTabChange' | 'fullWidth'>

export const NavContainer: FC<NavContainer> = ({ tabs, onTabChange, fullWidth }) => {
  return (
    <Container fullWidth={fullWidth}>
      <TabBar border={!fullWidth}>
        {tabs.map(({ route: { pathname }, text, name }) => (
          <TabBar.Item
            data-testid={`select-tab-${name}`}
            exact
            key={pathname}
            replace
            to={pathname}
            onClick={() => onTabChange && onTabChange(name)}
          >
            {text}
          </TabBar.Item>
        ))}
      </TabBar>
    </Container>
  )
}
