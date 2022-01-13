import { Toast } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { useTranslation } from 'react-i18next'

export const StatementReadyToast = ({ onDownload }: { onDownload: VoidFunction }) => {
  const { t } = useTranslation('components.StatementReadyToast')

  return (
    <Toast>
      <Toast.Indicator>
        <Icons.Check size={20} />
      </Toast.Indicator>
      <Toast.Label>{t('label')}</Toast.Label>
      <Toast.Action onClick={onDownload}>{t('button')}</Toast.Action>
    </Toast>
  )
}
