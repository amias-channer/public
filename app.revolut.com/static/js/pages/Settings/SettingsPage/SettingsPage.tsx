import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Spacer } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'
import { PageWithSidebarLayout } from 'components'
import { ThemeProvider } from '@revolut/ui-kit'
import { theme } from '@revolut/rwa-core-styles'
import { SETTINGS_I18N_NAMESPACE } from '../constants'
import { SettingsSection } from './SettingsSection'
import { SettingsSectionItem } from './SettingsSectionItem'

export const SettingsPage: FC = () => {
  const history = useHistory()
  const { t } = useTranslation(SETTINGS_I18N_NAMESPACE)

  const goToPersonalDetails = () => {
    history.push(Url.PersonalDetails)
  }

  const goToPasscodeChange = () => {
    history.push(Url.ChangePasscode)
  }

  return (
    <PageWithSidebarLayout title={t('title')}>
      <ThemeProvider theme={theme}>
        <Spacer h="px40" />
        <SettingsSection title={t('profileSection.title')}>
          <SettingsSectionItem
            Icon={Icons.Profile}
            title={t('profileSection.personalDetails.title')}
            onClick={goToPersonalDetails}
          />
        </SettingsSection>
        <Spacer h="px32" />
        <SettingsSection title={t('securitySection.title')}>
          <SettingsSectionItem
            Icon={Icons.ChangePasscode}
            title={t('securitySection.passcode.title')}
            onClick={goToPasscodeChange}
          />
        </SettingsSection>
      </ThemeProvider>
    </PageWithSidebarLayout>
  )
}
