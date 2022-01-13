import { secureStorage, SecureStorageKey } from '../storage'

const base64Decode = window.atob

export const base64Encode = window.btoa

export const decodeAccessToken = (accessToken: string) =>
  base64Decode(accessToken).split(':')

export const encodeAccessToken = (username: string, password: string) =>
  base64Encode(`${username}:${password}`)

export const isRestrictedAccessToken = () =>
  secureStorage.getItem<boolean>(SecureStorageKey.AuthTokenIsRestricted) || undefined
