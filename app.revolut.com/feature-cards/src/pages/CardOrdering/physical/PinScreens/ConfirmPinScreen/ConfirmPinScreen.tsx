import { FC, useState } from 'react'
import { Header, Layout, useMultipleCodeInput } from '@revolut/ui-kit'

import { MultipleDigitInput, useModal } from '@revolut/rwa-core-components'

import { useCardsTranslation } from '../../../../../hooks'
import { PinsNotMatchPopup } from '../../popups'
import { isPinFilled } from '../utils'

type ConfirmPinScreenProps = {
  initialPin: string
  onGoBack: VoidFunction
  onPinSubmit: (value: string) => void
}

export const ConfirmPinScreen: FC<ConfirmPinScreenProps> = ({
  initialPin,
  onGoBack,
  onPinSubmit,
}) => {
  const t = useCardsTranslation()
  const [pin, setPin] = useState('')

  const [showPinsNotMatchPopup, pinsNotMatchPopupProps] = useModal()

  const handlePinInputChange = (value: string) => {
    setPin(value)

    if (isPinFilled(value)) {
      if (value === initialPin) {
        onPinSubmit(value)
      } else {
        showPinsNotMatchPopup()
      }
    }
  }

  const pinInputProps = useMultipleCodeInput({
    autoFocus: true,
    size: 4,
    value: pin,
    onChange: handlePinInputChange,
  })

  return (
    <>
      <Layout>
        <Layout.Main>
          <Header variant="form">
            <Header.BackButton aria-label="Back" onClick={onGoBack} />

            <Header.Title>{t('CardOrdering.ConfirmPinScreen.title')}</Header.Title>

            <Header.Description>
              {t('CardOrdering.ConfirmPinScreen.description')}
            </Header.Description>
          </Header>
          <MultipleDigitInput size={4} inputsProps={pinInputProps} />
        </Layout.Main>
      </Layout>
      <PinsNotMatchPopup {...pinsNotMatchPopupProps} onRequestClose={onGoBack} />
    </>
  )
}
