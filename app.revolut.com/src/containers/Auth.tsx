import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { logout, signIn } from '../redux/reducers/auth'
import { getItemFromLocalStorage, LocalStorage } from '../constants/storage'
import { StorageSigninType } from '../api/types'
import { loggedInSelector } from '../redux/selectors/auth'

interface AuthProps {
  userId: string
}

export const Auth = (Component: React.ComponentClass) =>
  React.memo((props: AuthProps) => {
    const { userId } = props
    const dispatch = useDispatch()
    const loggedIn = useSelector(loggedInSelector)

    React.useEffect(() => {
      const storageUserInfo: StorageSigninType =
        getItemFromLocalStorage(LocalStorage.CHAT_AUTH_TOKEN) || {}
      const storageAnonSession = getItemFromLocalStorage(
        LocalStorage.CHAT_ANON_SESSION
      )

      if (loggedIn) {
        if (
          userId &&
          storageUserInfo &&
          (storageUserInfo.anonymous || userId !== storageUserInfo.clientId)
        ) {
          dispatch(
            signIn({
              clientId: userId,
              anonymous: false,
              fromStorage: false,
            })
          )
        }

        if (!userId && storageUserInfo && !storageUserInfo.anonymous) {
          dispatch(logout())
        }
      } else if (userId) {
        dispatch(
          signIn({
            clientId: userId,
            anonymous: false,
            fromStorage: false,
          })
        )
      } else if (storageUserInfo && storageUserInfo.anonymous) {
        dispatch(signIn({ ...storageUserInfo, fromStorage: true }))
      } else if (storageAnonSession && storageAnonSession.clientId) {
        dispatch(
          signIn({
            ...storageAnonSession,
            fromStorage: true,
            anonymous: true,
          })
        )
      }
    }, [userId, loggedIn, dispatch])

    return <Component {...props} />
  })
