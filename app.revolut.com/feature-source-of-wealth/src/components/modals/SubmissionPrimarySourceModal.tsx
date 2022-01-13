import { FC } from 'react'
import { Popup, Header, Image, Button } from '@revolut/ui-kit'

import { getAsset, AssetProject } from '@revolut/rwa-core-utils'

import { useTranslation } from '../../hooks'
import { I18nNamespace } from '../../utils'

const IMAGE_SIZE = 320

type SubmissionPrimarySourceModalProps = {
  isOpen?: boolean
  onExit: VoidFunction
  onAdd: VoidFunction
}

export const SubmissionPrimarySourceModal: FC<SubmissionPrimarySourceModalProps> = ({
  isOpen = false,
  onExit,
  onAdd,
}) => {
  const { t } = useTranslation(I18nNamespace.ComponentsModals)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)

  return (
    <Popup isOpen={isOpen} onExit={onExit} variant="colorful">
      <Header variant="form">
        <Header.CloseButton aria-label="Close" />
        <Header.Title>{t('SubmissionMoreModal.title')}</Header.Title>
        <Header.Description>{t('SubmissionMoreModal.description')}</Header.Description>
      </Header>

      <Image
        mx="auto"
        size={IMAGE_SIZE}
        src={getAsset(
          'business/illustrations-repository/checkdesk-point-lens@2x.png',
          AssetProject.Media,
        )}
      />
      <Popup.Actions>
        <Button variant="white" onClick={onAdd} elevated>
          {tCommon('incomeSourceAdd')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
