import noop from 'lodash/noop'
import { useTranslation } from 'react-i18next'
import { Warning } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { I18nNamespace, IconSize } from '@revolut/rwa-core-utils'

type PasscodesNotMatchModalProps = {
  onConfirm: VoidFunction
}

export const PasscodesNotMatchModal: ModalComponent<PasscodesNotMatchModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  const { t } = useTranslation(['pages.Settings', I18nNamespace.Common])

  const handleConfirm = async () => {
    onConfirm()
    onRequestClose()
  }

  return (
    <ModalLayout
      Icon={<Warning size={IconSize.Large} color="warning" />}
      title={t('ChangePasscode.PasscodesNotMatchModal.title')}
      primaryButtonText={t(`${I18nNamespace.Common}:try_again`)}
      primaryButtonProps={{
        onClick: handleConfirm,
      }}
      isOpen={isOpen}
      onRequestClose={noop}
    />
  )
}
