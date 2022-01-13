import { VFC } from 'react'

import { useTranslation } from 'react-i18next'

import { Popup, Header, Text, Button, Flex } from '@revolut/ui-kit'
import { I18nNamespace as CoreI18nNamespace } from '@revolut/rwa-core-utils'

import { I18nNamespace } from '../../utils'
import { LogoutPopupViewProps } from './types'

export const LogoutPopupView: VFC<LogoutPopupViewProps> = ({
  onCancel,
  onLogout,
  isCurrent,
}: LogoutPopupViewProps) => {
  const { t } = useTranslation(`${I18nNamespace.DEVICE_MANAGEMENT}.components`)
  const { t: commonT } = useTranslation(CoreI18nNamespace.Common)

  return (
    <Popup onExit={onCancel} variant="bottom-sheet" isOpen>
      <Header variant="bottom-sheet">
        <Header.Title>{t(`${I18nNamespace.LOGOUT_POPUP}.title`)}</Header.Title>{' '}
      </Header>
      <Text variant="caption" color="grey-tone-50">
        {isCurrent
          ? t(`${I18nNamespace.LOGOUT_POPUP}.currentDeviceWarning`)
          : t(`${I18nNamespace.LOGOUT_POPUP}.otherDeviceWarning`)}
      </Text>
      <Popup.Actions>
        <Flex>
          <Button variant="secondary" onClick={onCancel} mr="s-16">
            {t(`${I18nNamespace.LOGOUT_POPUP}.cancel`)}
          </Button>
          <Button variant="primary" onClick={onLogout} disabled={!onLogout}>
            {commonT('logout')}
          </Button>
        </Flex>
      </Popup.Actions>
    </Popup>
  )
}
