import { useContext } from 'react'

import { LocaleContext } from '../../providers'

export const useLocale = () => {
  return useContext(LocaleContext)
}
