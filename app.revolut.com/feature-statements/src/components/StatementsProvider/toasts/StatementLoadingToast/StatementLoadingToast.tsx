import { Spinner, Toast } from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'

export const StatementLoadingToast = () => {
  const { t } = useTranslation('components.StatementLoadingToast')

  return (
    <Toast>
      <Toast.Indicator>
        <Spinner size={20} />
      </Toast.Indicator>
      <Toast.Label>{t('label')}</Toast.Label>
    </Toast>
  )
}
