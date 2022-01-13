import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Banner, Box } from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { Revolut } from '@revolut/rwa-core-components'

import { TRANSLATION_NAMESPACE, TestIds } from './constants'
import { SignUpButton } from './SignUpButton'

export const LoggedOutSideBanner: FC = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE)
  const { isAuthorized } = useAuthContext()

  if (isAuthorized) return null

  return (
    <Banner hide="*-xl" data-testid={TestIds.Root}>
      <Banner.Content>
        <Banner.Title>
          <Box mb="s-8">
            <Revolut width={80} />
          </Box>
        </Banner.Title>
        <Banner.Description>
          {t('SignUpCTA')}
          <SignUpButton mt={16} />
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}
