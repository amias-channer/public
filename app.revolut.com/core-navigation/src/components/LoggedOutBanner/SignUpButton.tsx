import { VFC } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, ButtonProps, Text } from '@revolut/ui-kit'

import { redirectAfterSignIn } from '@revolut/rwa-core-auth'
import { Url } from '@revolut/rwa-core-utils'

import { TRANSLATION_NAMESPACE } from './constants'

export const SignUpButton: VFC<ButtonProps> = (props) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE)
  const history = useHistory()

  const handleClick = () => {
    redirectAfterSignIn.saveUrl()

    history.push(Url.Root)
  }

  return (
    <Button {...props} size="sm" onClick={handleClick}>
      <Text whiteSpace="nowrap">{t('SignUp')}</Text>
    </Button>
  )
}
