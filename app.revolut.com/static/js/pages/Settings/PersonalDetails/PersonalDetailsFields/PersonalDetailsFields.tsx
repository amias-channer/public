import { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { PersonalDetailsComponentProps } from '../types'
import {
  AddressField,
  BirthDateField,
  EmailField,
  PhoneNumberField,
  UserNameField,
} from './Fields'

export const PersonalDetailsFields: FC<PersonalDetailsComponentProps> = ({
  userData,
}) => {
  const history = useHistory()

  const handlePhoneNumberEditClick = () => {
    history.push(Url.ChangePhoneNumber)
  }

  return (
    <Box width={{ _: '100%', md: '55%' }}>
      <UserNameField userData={userData} />
      <Spacer h="px16" />
      <BirthDateField birthDate={userData.birthDate} />
      <Spacer h="px16" />
      <AddressField address={userData.address} />
      <Spacer h="px16" />
      <PhoneNumberField phone={userData.phone} onEdit={handlePhoneNumberEditClick} />
      <Spacer h="px16" />
      <EmailField email={userData.email} isVerified={userData.emailVerified} />
    </Box>
  )
}
