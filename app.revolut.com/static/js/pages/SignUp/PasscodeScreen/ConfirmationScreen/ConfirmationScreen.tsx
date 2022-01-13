import { PasscodeLayout, PasscodeLayoutProps } from '@revolut/rwa-core-components'

import { useSignUpTranslation } from '../../hooks'

export const ConfirmationScreen: PasscodeLayoutProps = (props) => {
  const t = useSignUpTranslation()

  return (
    <PasscodeLayout {...props} title={t('PasscodeScreen.ConfirmationScreen.title')} />
  )
}
