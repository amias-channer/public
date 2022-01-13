import { useTranslation } from 'react-i18next'

import { CARDS_I18N_NAMESPACE } from '../helpers'

export const useCardsTranslation = () => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)

  return t
}
