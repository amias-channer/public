import { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Flex, Box } from '@revolut/ui-kit'

import { NavContainer } from './NavContainer'
import { Container } from './styled'
import { TabsLayoutProps } from './types'

export const TabsLayout: FC<TabsLayoutProps> = ({
  tabs,
  screens,
  onTabChange,
  fullWidth,
  header,
}) => {
  return (
    <Container>
      <Box>
        {header}
        <Flex flexDirection="column" mx="auto">
          <NavContainer tabs={tabs} onTabChange={onTabChange} fullWidth={fullWidth} />
          <Switch>
            {tabs.map(({ route: { pathname }, name }) => (
              <Route
                exact
                key={pathname}
                path={pathname}
                render={() => (
                  <Box data-testid={name} flex={1} m="0" pb="2.5rem">
                    {screens[name]()}
                  </Box>
                )}
              />
            ))}
          </Switch>
        </Flex>
      </Box>
    </Container>
  )
}
