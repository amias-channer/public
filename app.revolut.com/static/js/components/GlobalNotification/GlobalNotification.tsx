import { FC } from 'react'

import { useAuthContext } from '@revolut/rwa-core-auth'

import { FrozenCardModal, useFrozenCardModal } from 'components/Modals/FrozenCardModal'

const FrozenCardNotification = () => {
  const frozenCardModalProps = useFrozenCardModal()

  return <FrozenCardModal {...frozenCardModalProps} />
}

export const GlobalNotification: FC = ({ children }) => {
  const { isAuthorized } = useAuthContext()

  return (
    <>
      {children}
      {isAuthorized && <FrozenCardNotification />}
    </>
  )
}
