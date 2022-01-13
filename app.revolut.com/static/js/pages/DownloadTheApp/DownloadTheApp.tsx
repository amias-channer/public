import { FC, useCallback, useState } from 'react'

import { DownloadTheAppScreen } from './constants'
import { DownloadTheAppProvider } from './DownloadTheAppProvider'
import { MobileNumberScreen } from './MobileNumberScreen'
import { SuccessScreen } from './SuccessScreen'
import { DownloadTheAppScreenProps, DownloadTheAppScreenChangeFunc } from './types'

const SCREENS: { [T in DownloadTheAppScreen]: FC<DownloadTheAppScreenProps> } = {
  [DownloadTheAppScreen.MobileNumber]: MobileNumberScreen,
  [DownloadTheAppScreen.Success]: SuccessScreen,
}

export const DownloadTheApp: FC = () => {
  const [currentScreen, setCurrentScreen] = useState<DownloadTheAppScreen>(
    DownloadTheAppScreen.MobileNumber,
  )

  const handleScreenChange = useCallback<DownloadTheAppScreenChangeFunc>(
    (nextScreen) => {
      setCurrentScreen(nextScreen)
    },
    [setCurrentScreen],
  )

  const CurrentScreenComponent = SCREENS[currentScreen]

  return (
    <DownloadTheAppProvider>
      <CurrentScreenComponent onScreenChange={handleScreenChange} />
    </DownloadTheAppProvider>
  )
}
