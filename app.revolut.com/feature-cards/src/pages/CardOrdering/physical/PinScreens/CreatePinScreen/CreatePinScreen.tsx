import { FC, useState } from 'react'
import { Header, Layout, useMultipleCodeInput } from '@revolut/ui-kit'

import { MultipleDigitInput, useModal } from '@revolut/rwa-core-components'

import { useCardsTranslation } from '../../../../../hooks'
import { EasyPinPopup } from '../../popups'
import { isPinFilled, isPinWeak } from '../utils'

type CreatePinScreenProps = {
  onGoBack: VoidFunction
  onPinSubmit: (value: string) => void
}

export const CreatePinScreen: FC<CreatePinScreenProps> = ({ onGoBack, onPinSubmit }) => {
  const t = useCardsTranslation()
  const [pin, setPin] = useState('')

  const [showEasyPinPopup, pinsNotMatchModalProps] = useModal()

  const handlePinInputChange = (value: string) => {
    setPin(value)

    if (isPinFilled(value)) {
      if (isPinWeak(value)) {
        showEasyPinPopup()
      } else {
        onPinSubmit(value)
      }
    }
  }

  const pinInputProps = useMultipleCodeInput({
    autoFocus: true,
    size: 4,
    value: pin,
    onChange: handlePinInputChange,
  })

  const handleChangeWeakPin = () => {
    setPin('')
    pinInputProps[0].ref.current?.focus()
  }

  const handleContinueWithWeakPin = () => {
    onPinSubmit(pin)
  }

  return (
    <>
      <Layout>
        <Layout.Main>
          <Header variant="form">
            <Header.BackButton aria-label="Back" onClick={onGoBack} />

            <Header.Title>{t('CardOrdering.CreatePinScreen.title')}</Header.Title>

            <Header.Description>
              {t('CardOrdering.CreatePinScreen.description')}
            </Header.Description>
          </Header>
          <MultipleDigitInput size={4} inputsProps={pinInputProps} />
        </Layout.Main>
      </Layout>
      <EasyPinPopup
        {...pinsNotMatchModalProps}
        onChangeClick={handleChangeWeakPin}
        onContinueClick={handleContinueWithWeakPin}
      />
    </>
  )
}
