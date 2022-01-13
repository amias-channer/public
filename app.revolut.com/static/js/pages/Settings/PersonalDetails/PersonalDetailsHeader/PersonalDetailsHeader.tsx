import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'
import { UserAvatar } from '@revolut/rwa-core-navigation'

import { getFullName } from 'utils'

import { SETTINGS_I18N_NAMESPACE } from '../../constants'
import { PersonalDetailsComponentProps } from '../types'
import { PersonalDetailsSubtitle, PersonalDetailsTitle } from './styled'

export const PersonalDetailsHeader: FC<PersonalDetailsComponentProps> = ({
  userData,
}) => {
  const { t } = useTranslation(SETTINGS_I18N_NAMESPACE)

  const fullUserName = getFullName(userData)

  return (
    <Flex alignItems="flex-start" justifyContent="space-between">
      <Box>
        <PersonalDetailsTitle>{fullUserName}</PersonalDetailsTitle>
        <Spacer h="px8" />
        <PersonalDetailsSubtitle>
          {t('PersonalDetails.header.subtitle')}
        </PersonalDetailsSubtitle>
      </Box>
      <UserAvatar
        size={{ _: 'md', md: 'xl' }}
        userId={userData.id}
        userName={fullUserName}
      />
    </Flex>
  )
}
