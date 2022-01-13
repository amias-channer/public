import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Group, Subheader } from '@revolut/ui-kit'

import { CARDS_I18N_NAMESPACE } from '../../../../helpers'
import { UnblockPinCvvAction } from '../../actions'

type PinSettingsProps = {
  cardId: string
}

export const PinSettings: FC<PinSettingsProps> = ({ cardId }) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)

  return (
    <>
      <Subheader>
        <Subheader.Title>{t('CardSettings.PinSettings.title')}</Subheader.Title>
      </Subheader>
      <Group>
        <UnblockPinCvvAction
          cardId={cardId}
          titleKey="CardSettings.pin.unblock.title"
          descriptionKey="CardSettings.pin.unblock.subtitle"
        />
      </Group>
    </>
  )
}
