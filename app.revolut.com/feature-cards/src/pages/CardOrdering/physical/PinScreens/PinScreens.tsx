import { FC, useState } from 'react'

import { ConfirmPinScreen } from './ConfirmPinScreen'
import { CreatePinScreen } from './CreatePinScreen'

type PinScreensProps = {
  onGoBack: VoidFunction
  onSubmit: (pin: string) => void
}

export const PinScreens: FC<PinScreensProps> = ({ onGoBack, onSubmit }) => {
  const [initialPin, setInitialPin] = useState<string>()

  const handleInitialPinSubmit = (value: string) => {
    setInitialPin(value)
  }

  const goToCreatePinScreen = () => {
    setInitialPin('')
  }

  return !initialPin ? (
    <CreatePinScreen onGoBack={onGoBack} onPinSubmit={handleInitialPinSubmit} />
  ) : (
    <ConfirmPinScreen
      initialPin={initialPin}
      onGoBack={goToCreatePinScreen}
      onPinSubmit={onSubmit}
    />
  )
}
