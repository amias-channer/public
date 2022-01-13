import React, { FC } from 'react'
import { InputVariant, ThemeProvider } from '@revolut/ui-kit'
import { LocationProvider } from '@reach/router'

import { Api } from '../api'
import theme from '../theme'
import {
  WidgetContext,
  ApiContext,
  NavigationObstacleProvider,
  ImagePreviewCacheProvider,
} from '.'

type Props = {
  api: Api
  inputVariant?: InputVariant
}

export const AllWidgetProviders: FC<Props> = ({ api, inputVariant, children }) => (
  <ApiContext.Provider value={api}>
    <WidgetContext.Provider value={{ isWidgetMode: true, inputVariant }}>
      <ThemeProvider theme={theme}>
        <LocationProvider>
          <NavigationObstacleProvider>
            <ImagePreviewCacheProvider>{children}</ImagePreviewCacheProvider>
          </NavigationObstacleProvider>
        </LocationProvider>
      </ThemeProvider>
    </WidgetContext.Provider>
  </ApiContext.Provider>
)
