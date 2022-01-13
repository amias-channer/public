import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Avatar, Group, Item, Popup, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'

import { useCardsTranslation } from '../../../../../hooks'

type CardOptionsDialogProps = {
  isCardDetailsRevealed: boolean
  onCopyCardNumber: VoidFunction
  onShowCardDetails: VoidFunction
  onHideCardDetails: VoidFunction
} & BaseModalProps

export const CardOptionsDialog: FC<CardOptionsDialogProps> = ({
  isCardDetailsRevealed,
  isOpen,
  onRequestClose,
  onCopyCardNumber,
  onShowCardDetails,
  onHideCardDetails,
}) => {
  const t = useCardsTranslation()

  const handleShowCardDetailsClicked = () => {
    onRequestClose()
    onShowCardDetails()
  }

  const handleHideCardDetailsClicked = () => {
    onRequestClose()
    onHideCardDetails()
  }

  const handleCopyCardNumberClicked = () => {
    onRequestClose()
    onCopyCardNumber()
  }

  return (
    <ThemeProvider theme={UnifiedTheme}>
      <Popup
        isOpen={isOpen}
        focusTrap={false}
        variant="bottom-sheet"
        onExit={onRequestClose}
      >
        <Group>
          <Item
            use="button"
            onClick={
              isCardDetailsRevealed
                ? handleHideCardDetailsClicked
                : handleShowCardDetailsClicked
            }
          >
            <Item.Avatar>
              <Avatar useIcon={isCardDetailsRevealed ? Icons.EyeHide : Icons.EyeShow} />
            </Item.Avatar>
            <Item.Content color="primary">
              {isCardDetailsRevealed
                ? t('CardOptionsDialog.button.hideCardDetails')
                : t('CardOptionsDialog.button.showCardDetails')}
            </Item.Content>
          </Item>
          <Item use="button" onClick={handleCopyCardNumberClicked}>
            <Item.Avatar>
              <Avatar useIcon={Icons.Copy} />
            </Item.Avatar>
            <Item.Content color="primary">
              {t('CardOptionsDialog.button.copyCardNumber')}
            </Item.Content>
          </Item>
        </Group>
      </Popup>
    </ThemeProvider>
  )
}
