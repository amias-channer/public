import { FC, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import noop from 'lodash/noop'
import {
  DURATIONS,
  EASINGS,
  ThemeProvider,
  TransitionSlide,
  UnifiedTheme,
} from '@revolut/ui-kit'

import { ToastContainer } from './styled'
import { StatementToastContainerPositions } from './types'

const LAYOUT_MAIN_ELEMENT_SELECTOR = 'main'

const DEFAULT_POSITIONS_VALUE: StatementToastContainerPositions = {
  leftPosition: 0,
  rightPosition: 0,
}

export const StatementToastWrapper: FC = ({ children }) => {
  const location = useLocation()

  const [positions, setPositions] = useState<StatementToastContainerPositions>(
    DEFAULT_POSITIONS_VALUE,
  )

  useLayoutEffect(() => {
    const layoutMainElement = document.querySelector(LAYOUT_MAIN_ELEMENT_SELECTOR)

    if (layoutMainElement) {
      const updateToastWrapperPosition = () => {
        const rect = layoutMainElement.getBoundingClientRect()

        setPositions({
          leftPosition: rect.left,
          rightPosition: window.innerWidth - rect.right,
        })
      }

      const resizeObserver = new ResizeObserver(updateToastWrapperPosition)

      resizeObserver.observe(layoutMainElement)

      window.addEventListener('resize', updateToastWrapperPosition)

      return () => {
        window.removeEventListener('resize', updateToastWrapperPosition)
        resizeObserver.disconnect()
      }
    }

    return noop
    // in order to update when location changes
  }, [location])

  return (
    <ThemeProvider theme={UnifiedTheme} mode="dark">
      <ToastContainer {...positions}>
        <TransitionSlide
          in={Boolean(children)}
          exitAnimation={{ duration: DURATIONS.sm }}
          easing={`cubicBezier(${EASINGS.toast})`}
          offsetY="-100%"
        >
          <div>{children}</div>
        </TransitionSlide>
      </ToastContainer>
    </ThemeProvider>
  )
}
