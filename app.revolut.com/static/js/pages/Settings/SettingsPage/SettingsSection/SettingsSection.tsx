import { FC } from 'react'
import { Box } from '@revolut/ui-kit'

import { PageSectionTitle } from '@revolut/rwa-core-components'

type SettingsSectionProps = {
  title: string
}

export const SettingsSection: FC<SettingsSectionProps> = ({ title, children }) => (
  <Box>
    <PageSectionTitle>{title}</PageSectionTitle>
    {children}
  </Box>
)
