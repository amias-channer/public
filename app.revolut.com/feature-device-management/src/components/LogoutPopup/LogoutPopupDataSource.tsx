import { VFC, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { SignOutCause, signOutWithRedirect, useAuthContext } from '@revolut/rwa-core-auth'

import { Url as DeviceManagementUrl } from '../../consts'
import { usePopup, useSignout } from '../../hooks'
import { PasscodePopup } from '../PasscodePopup'
import { LogoutPopupView } from './LogoutPopupView'
import { LogoutPopupDataSourceProps } from './types'

export const LogoutPopupDataSource: VFC<LogoutPopupDataSourceProps> = ({
  deviceTitle,
  isCurrent,
  deviceId,
}: LogoutPopupDataSourceProps) => {
  const { setPopup } = usePopup()
  const { mutate: signout } = useSignout()
  const history = useHistory()

  const { user } = useAuthContext()

  const handleClosePopup = useCallback(() => setPopup(null), [setPopup])
  const handleConfirmLogout = useCallback(() => {
    if (isCurrent) {
      signOutWithRedirect(SignOutCause.User)
    } else {
      user &&
        signout(
          { userId: user.id, deviceId },
          {
            onSuccess: () => {
              history.push(DeviceManagementUrl.DeviceManagement)
              setPopup(<PasscodePopup deviceTitle={deviceTitle} />)
            },
          },
        )
    }
  }, [setPopup, deviceTitle, history, signout, deviceId, isCurrent, user])

  return (
    <LogoutPopupView
      onCancel={handleClosePopup}
      onLogout={user && handleConfirmLogout}
      isCurrent={isCurrent}
    />
  )
}
