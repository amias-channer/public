import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

import { ErrorPopup, useModal } from '@revolut/rwa-core-components'

import { CARDS_I18N_NAMESPACE } from '../../../../helpers'
import { useUnblockPinCvv } from './hooks'
import { UnblockPinCvvPopup } from './UnblockPinCvvPopup'
import { UnblockPinCvvSuccessPopup } from './UnblockPinCvvSuccessPopup'

type UnblockPinCvvActionProps = {
  cardId: string
  titleKey: string
  descriptionKey: string
}

export const UnblockPinCvvAction: FC<UnblockPinCvvActionProps> = ({
  cardId,
  titleKey,
  descriptionKey,
}) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const [showUnblockPinCvvPopup, unblockPinCvvPopupProps] = useModal()
  const [showUnblockPinCvvSuccessPopup, unblockPinCvvSuccessPopupProps] = useModal()
  const [showErrorPopup, errorPopupProps] = useModal()
  const { unblockCardPinCvv, isLoading: isUnblocking } = useUnblockPinCvv()

  const handleUnblockPinCvv = () => {
    unblockCardPinCvv(cardId, {
      onSuccess: () => {
        unblockPinCvvPopupProps.onRequestClose()
        showUnblockPinCvvSuccessPopup()
      },
      onError: () => {
        unblockPinCvvPopupProps.onRequestClose()
        showErrorPopup()
      },
    })
  }

  return (
    <>
      <Item use="button" onClick={showUnblockPinCvvPopup}>
        <Item.Avatar>
          <Avatar useIcon={Icons.LockOpened} />
        </Item.Avatar>
        <Item.Content>
          <Item.Title>{t(titleKey)}</Item.Title>
          <Item.Description>{t(descriptionKey)}</Item.Description>
        </Item.Content>
      </Item>
      <UnblockPinCvvPopup
        {...unblockPinCvvPopupProps}
        isUnblocking={isUnblocking}
        onSubmit={handleUnblockPinCvv}
      />
      <UnblockPinCvvSuccessPopup {...unblockPinCvvSuccessPopupProps} />
      <ErrorPopup {...errorPopupProps} />
    </>
  )
}
