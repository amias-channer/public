import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Media, Popup, Text } from '@revolut/ui-kit'

import { I18N_NAMESPACE } from '../../constants'

export const MethodSelectPopupHeader: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <Popup.Header>
      <Popup.BackButton />
      <Popup.Title>
        {t('facelift.TopUpMethodsScreen.MethodSelect.popup.title')}
      </Popup.Title>
      <Popup.Description>
        <Media>
          <Media.Side mr="s-8" alignSelf="center">
            <Icons.LockClosed size="16" />
          </Media.Side>
          <Media.Content>
            <Text use="p">
              {t('facelift.TopUpMethodsScreen.MethodSelect.popup.description')}
            </Text>
          </Media.Content>
        </Media>
      </Popup.Description>
    </Popup.Header>
  )
}
