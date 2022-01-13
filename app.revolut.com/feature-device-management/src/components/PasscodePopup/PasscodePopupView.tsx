import { VFC } from 'react'

import { useTranslation, Trans } from 'react-i18next'

import { Button, StatusPopup } from '@revolut/ui-kit'

import { I18nNamespace } from '../../utils'
import { PasscodePopupViewProps } from './types'

export const PasscodePopupView: VFC<PasscodePopupViewProps> = ({
  deviceTitle,
  onExit,
  onChangePasscode,
}: PasscodePopupViewProps) => {
  const { t } = useTranslation(`${I18nNamespace.DEVICE_MANAGEMENT}.components`)
  const { t: pagesT } = useTranslation('pages.Settings')

  return (
    <StatusPopup variant="success-result" isOpen onExit={onExit}>
      <StatusPopup.Title>
        <Trans
          i18nKey={`${I18nNamespace.PASSCODE_POPUP}.title`}
          t={t}
          values={{ device: deviceTitle }}
        />
      </StatusPopup.Title>
      <StatusPopup.Description>
        {t(`${I18nNamespace.PASSCODE_POPUP}.description`)}
      </StatusPopup.Description>
      <StatusPopup.Actions>
        <Button onClick={onChangePasscode}>
          {pagesT('securitySection.passcode.title')}
        </Button>
        <Button variant="secondary" onClick={onExit}>
          {t(`${I18nNamespace.PASSCODE_POPUP}.skip`)}
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  )
}
