import { secureStorage, SecureStorageKey } from '@revolut/rwa-core-utils'

export const getUserAuthData = () => {
  const userId = secureStorage.getItem(SecureStorageKey.AuthUsername)
  const accessToken = secureStorage.getItem(SecureStorageKey.AuthPassword)

  return {
    userId,
    accessToken,
  }
}
