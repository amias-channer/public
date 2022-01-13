import { useTranslation } from 'react-i18next'
import { Cross } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { I18nNamespace, IconSize } from '@revolut/rwa-core-utils'

type PostCodeInvalidModal = {
  postCode: string
}

export const PostCodeInvalidModal: ModalComponent<PostCodeInvalidModal> = ({
  isOpen,
  postCode,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  return (
    <ModalLayout
      Icon={<Cross size={IconSize.ExtraLarge} color="iconError" />}
      title={t('postcode.error', { postCode })}
      primaryButtonText={t('try_again')}
      primaryButtonProps={{
        onClick: onRequestClose,
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  )
}
