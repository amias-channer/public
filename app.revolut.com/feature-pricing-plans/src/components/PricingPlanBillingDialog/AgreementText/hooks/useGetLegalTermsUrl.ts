import { useAuthContext } from '@revolut/rwa-core-auth'
import { getLegalTermsUrl } from '@revolut/rwa-core-utils'

export const useGetLegalTermsUrl = () => {
  const { user } = useAuthContext()

  return user ? getLegalTermsUrl(user.address.country) : ''
}
