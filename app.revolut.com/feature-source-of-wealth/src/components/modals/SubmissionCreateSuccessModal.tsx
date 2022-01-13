import { FC } from 'react'
import { Popup, Header, Image, Button } from '@revolut/ui-kit'

import { getAsset, AssetProject } from '@revolut/rwa-core-utils'

import { useTranslation } from '../../hooks'
import { I18nNamespace } from '../../utils'

const IMAGE_SIZE = 320

type SubmissionCreateSuccessModalProps = {
  isOpen?: boolean
  onExit: VoidFunction
  onAdd: VoidFunction
}

export const SubmissionCreateSuccessModal: FC<SubmissionCreateSuccessModalProps> = ({
  isOpen = false,
  onExit,
  onAdd,
}) => {
  const { t } = useTranslation(I18nNamespace.ComponentsModals)

  return (
    <Popup isOpen={isOpen} onExit={onExit} variant="colorful">
      <Header variant="form">
        <Header.CloseButton aria-label="Close" />
        <Header.Title>{t('EvidenceCreateModal.title')}</Header.Title>
        <Header.Description>{t('EvidenceCreateModal.description')}</Header.Description>
      </Header>

      <Image
        mx="auto"
        size={IMAGE_SIZE}
        src={getAsset(
          'business/illustrations-repository/checklist-pencil@2x.png',
          AssetProject.Media,
        )}
      />
      <Popup.Actions>
        <Button variant="white" onClick={onAdd} elevated>
          {t('EvidenceCreateModal.button.add')}
        </Button>
        <Button variant="black" onClick={onExit} elevated>
          {t('EvidenceCreateModal.button.finish')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
