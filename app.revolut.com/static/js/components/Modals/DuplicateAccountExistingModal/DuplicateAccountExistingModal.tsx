import noop from 'lodash/noop'
import { useTranslation } from 'react-i18next'

import {
  ModalComponent,
  ModalLayout,
  StatusIcon,
  StatusIconType,
} from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

type DuplicateAccountExistingModalProps = {
  onLogIn: VoidFunction
}

export const DuplicateAccountExistingModal: ModalComponent<DuplicateAccountExistingModalProps> =
  ({ isOpen, onRequestClose, onLogIn }) => {
    const { t } = useTranslation('components.Modals')

    const handleLogIn = () => {
      onRequestClose()
      onLogIn()
    }

    return (
      <ModalLayout
        Icon={<StatusIcon size={IconSize.Large} type={StatusIconType.Info} />}
        title={t('DuplicateAccountExistingModal.title')}
        description={t('DuplicateAccountExistingModal.description')}
        primaryButtonText={t('DuplicateAccountExistingModal.logInButtonText')}
        primaryButtonProps={{
          onClick: handleLogIn,
        }}
        isOpen={isOpen}
        onRequestClose={noop}
      />
    )
  }
