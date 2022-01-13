import { FC, createContext, useContext, useState, useEffect } from 'react'
import isNil from 'lodash/isNil'

import { PhoneNumberValue, User } from '@revolut/rwa-core-types'
import {
  IS_JEST,
  IS_CYPRESS,
  IS_CI,
  getConfigValue,
  ConfigKey,
} from '@revolut/rwa-core-config'
import { AxiosSecurity, getDefaultPhoneNumberValue } from '@revolut/rwa-core-utils'

import { useGetUser as useGetUserDefault, UseGetUserReturn } from '../../hooks/api'
import { useSignOutChecker } from '../../hooks/useSignOutChecker'
import { AuthContextInitialValue, AuthContextType } from './types'

const EMPTY_DATA = {} as AuthContextType

export const AuthContext = createContext<AuthContextType>(EMPTY_DATA)

export type AuthProviderProps = {
  initialValue?: AuthContextInitialValue
  /**
   * @deprecated
   */
  useGetUser?: () => UseGetUserReturn
}

export const AuthProvider: FC<AuthProviderProps> = ({
  initialValue,
  useGetUser = useGetUserDefault,
  children,
}) => {
  if (!IS_CI && IS_JEST) {
    console.warn(
      'Please do not use `AuthProvider` in tests. Mock `useAuthContext` instead.',
    )
  }

  const [fetchedUser, isUserFetching, refetchUser] = useGetUser()

  const [signInFlowChannel, setSignInFlowChannel] = useState(
    initialValue?.signInFlowChannel,
  )
  const [beforeStepUpUrl, setBeforeStepUpUrl] = useState(initialValue?.beforeStepUpUrl)
  const [afterStepUpUrl, setAfterStepUpUrl] = useState(initialValue?.afterStepUpUrl)
  const [countryCode, setCountryCode] = useState(initialValue?.countryCode)
  const [flowItem, setFlowItem] = useState(initialValue?.flowItem)
  const [phoneNumber, setPhoneNumber] = useState<PhoneNumberValue>(
    initialValue?.phoneNumber ?? getDefaultPhoneNumberValue(),
  )
  const [securityCode, setSecurityCode] = useState<string>(
    initialValue?.securityCode ?? '',
  )
  const [passcode, setPasscode] = useState<string>(initialValue?.passcode ?? '')
  const [pushTokenId, setPushTokenId] = useState<string>(initialValue?.pushTokenId ?? '')
  const [isAuthorized, setAuthorized] = useState<boolean>(() =>
    getConfigValue<boolean>(ConfigKey.CookieAuth)
      ? !(isUserFetching || isNil(fetchedUser))
      : AxiosSecurity.hasAuth(),
  )
  const [user, setUser] = useState<User | undefined>(fetchedUser)

  useEffect(() => {
    if (IS_CYPRESS && !AxiosSecurity.hasAuth()) {
      return
    }

    setAuthorized(Boolean(fetchedUser))
    setUser(fetchedUser)
  }, [fetchedUser, setAuthorized, setUser])

  useSignOutChecker(isAuthorized && !isUserFetching)

  const value: AuthContextType = {
    signInFlowChannel,
    setSignInFlowChannel,

    beforeStepUpUrl,
    setBeforeStepUpUrl,

    afterStepUpUrl,
    setAfterStepUpUrl,

    countryCode,
    setCountryCode,

    flowItem,
    setFlowItem,

    phoneNumber,
    setPhoneNumber,

    securityCode,
    setSecurityCode,

    passcode,
    setPasscode,

    pushTokenId,
    setPushTokenId,

    isAuthorized,
    setAuthorized,

    user,
    refetchUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {!isAuthorized && isUserFetching ? null : children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)

  if (ctx === null) {
    throw new Error(
      'You can access context only in components inside "AuthProvider" component',
    )
  }

  return ctx
}
