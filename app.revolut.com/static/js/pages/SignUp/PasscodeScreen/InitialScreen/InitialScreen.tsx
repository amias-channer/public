import { PasscodeLayout, PasscodeLayoutProps } from '@revolut/rwa-core-components'

import { useSignUpTranslation } from '../../hooks'

type InitialScreenProps = {
  hasError: boolean
}

export const InitialScreen: PasscodeLayoutProps<InitialScreenProps> = ({
  hasError,
  ...rest
}) => {
  const t = useSignUpTranslation()

  const errorMessage = hasError ? t('PasscodeScreen.InitialScreen.errorMessage') : ''

  return (
    <PasscodeLayout
      {...rest}
      title={t('PasscodeScreen.InitialScreen.title')}
      errorMessage={errorMessage}
    />
  )
}
