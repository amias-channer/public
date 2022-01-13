import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Box } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'

import { I18N_NAMESPACE } from '../../constants'
import { Hint } from '../Hint'

export const Hints: FC = () => {
  const { t } = useTranslation([I18N_NAMESPACE])

  return (
    <Box mt="px16">
      <Hint
        Icon={Icons.Profile}
        title={t('BeforeYouStartScreen.hintsSection.onlyOnePerson')}
      />
      <Spacer h="px16" />
      <Hint
        Icon={Icons.Lightbulb}
        title={t('BeforeYouStartScreen.hintsSection.goodLighting')}
      />
      <Spacer h="px16" />
      <Hint
        Icon={Icons.Anonymous}
        title={t('BeforeYouStartScreen.hintsSection.obscuringItems')}
      />
    </Box>
  )
}
