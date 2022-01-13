import { useTranslation } from 'react-i18next'

import { currencyLocalization } from '../../utils/i18n'

export const useCurrencyName = (currency: string) => {
  const { t } = useTranslation('domain')

  return t(currencyLocalization.getCurrencyDisplayNameByCode(currency))
}
