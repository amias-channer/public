import { FC } from 'react'
import { useHistory } from 'react-router-dom'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { Spacer } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { PageLayout } from 'components'

import { PersonalDetailsFields } from './PersonalDetailsFields'
import { PersonalDetailsHeader } from './PersonalDetailsHeader'

export const PersonalDetails: FC = () => {
  const history = useHistory()
  const { user } = useAuthContext()

  const handleBackButtonClick = () => {
    history.push(Url.Settings)
  }

  return (
    <PageLayout isLoading={!user} onBackButtonClick={handleBackButtonClick}>
      {user && (
        <>
          <PersonalDetailsHeader userData={user} />
          <Spacer h="px24" />
          <PersonalDetailsFields userData={user} />
        </>
      )}
    </PageLayout>
  )
}
