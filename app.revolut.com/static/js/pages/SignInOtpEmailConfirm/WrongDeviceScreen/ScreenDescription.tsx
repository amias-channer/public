import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Text } from '@revolut/ui-kit'

import { I18N_NAMESPACE } from '../constants'

export const ScreenDescription: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <>
      <Text>
        <Trans
          t={t}
          i18nKey="WrongDeviceScreen.description"
          components={{
            bold: <strong />,
          }}
        />
      </Text>
    </>
  )
}
