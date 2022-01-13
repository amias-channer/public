import noop from 'lodash/noop'
import { useTranslation } from 'react-i18next'

import {
  ModalComponent,
  ModalLayout,
  StatusIcon,
  StatusIconType,
} from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

type DuplicateAccountSimilarModalProps = {
  onLogIn: VoidFunction
  onContinue: VoidFunction
}

export const DuplicateAccountSimilarModal: ModalComponent<DuplicateAccountSimilarModalProps> =
  ({ isOpen, onRequestClose, onLogIn, onContinue }) => {
    const { t } = useTranslation('components.Modals')

    const handleLogIn = () => {
      onRequestClose()
      onLogIn()
    }

    const handleContinue = () => {
      onRequestClose()
      onContinue()
    }

    return (
      <ModalLayout
        Icon={<StatusIcon size={IconSize.Large} type={StatusIconType.Info} />}
        title={t('DuplicateAccountSimilarModal.title')}
        description={t('DuplicateAccountSimilarModal.description')}
        primaryButtonText={t('DuplicateAccountSimilarModal.logInButtonText')}
        primaryButtonProps={{
          onClick: handleLogIn,
        }}
        secondaryButtonText={t('DuplicateAccountSimilarModal.continueButtonText')}
        secondaryButtonProps={{ onClick: handleContinue }}
        isOpen={isOpen}
        onRequestClose={noop}
      />
    )
  }
