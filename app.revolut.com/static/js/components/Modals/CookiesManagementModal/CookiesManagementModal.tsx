import { FC, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShevronUp, ShevronDown } from '@revolut/icons'
import { Collapsible, Flex, Box, TextButton, Switch, Text } from '@revolut/ui-kit'

import {
  BaseModal,
  BaseModalProps,
  PrimaryButton,
  Spacer,
} from '@revolut/rwa-core-components'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { IconSize } from '@revolut/rwa-core-utils'

import { useCookiesPreferences } from 'hooks'

type Props = BaseModalProps

type RenderToggleParams = {
  isOpen: boolean
  toggle: (state?: boolean) => void
}

export const ANALYTICS_SWITCH_TEST_ID = 'AnalyticsCookiesSwitcher'

const toggleHeader =
  (title: string, switchElement: ReactNode) =>
  ({ isOpen, toggle }: RenderToggleParams) => {
    const Icon = isOpen ? ShevronUp : ShevronDown
    return (
      <Flex justifyContent="space-between" flexWrap="nowrap">
        <TextButton
          maxWidth={{ _: '210px', md: '100%' }}
          variant="black"
          onClick={() => toggle(!isOpen)}
        >
          <Flex flexWrap="nowrap" alignItems="center">
            {title}
            <Box ml="px8">
              <Icon size={IconSize.Small} />
            </Box>
          </Flex>
        </TextButton>
        <Box>{switchElement}</Box>
      </Flex>
    )
  }

export const CookiesManagementModal: FC<Props> = ({ isOpen, onRequestClose }) => {
  const { t } = useTranslation('components.Modals')

  const { cookiesPreferences, saveAndApplyNewPreferences } = useCookiesPreferences()

  const [currentPreferences, updatePreferences] = useState(cookiesPreferences)

  const onAnalyticsCookiesToggle = () => {
    updatePreferences({
      ...currentPreferences,
      analyticsTargetingEnabled: !currentPreferences.analyticsTargetingEnabled,
    })
  }

  const onSaveClick = () => {
    saveAndApplyNewPreferences(currentPreferences)
    onRequestClose()
  }

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <Collapsible
        renderToggle={toggleHeader(
          t('CookiesManagementModal.necessaryTitle'),
          <Text color="grey-50">{t('CookiesManagementModal.alwaysOnText')}</Text>,
        )}
      >
        <Box pt={2} color="grey-50">
          {t('CookiesManagementModal.necessaryText')}
        </Box>
      </Collapsible>
      <Spacer h="px16" />
      <Collapsible
        defaultIsOpen
        renderToggle={toggleHeader(
          t('CookiesManagementModal.analyticsTargetingTitle'),
          <Switch
            data-testid={ANALYTICS_SWITCH_TEST_ID}
            checked={currentPreferences.analyticsTargetingEnabled}
            onClick={onAnalyticsCookiesToggle}
          />,
        )}
      >
        <Box pt={2} color="grey-50">
          {t('CookiesManagementModal.analyticsTargetingText1')}
        </Box>
        <Box pt={2} color="grey-50">
          {t('CookiesManagementModal.analyticsTargetingText2')}
        </Box>
      </Collapsible>
      <Spacer h={{ _: 'px24', md: 'px40' }} />

      <PrimaryButton onClick={onSaveClick}>
        {t('CookiesManagementModal.savePreferences')}
      </PrimaryButton>
      <Spacer h={{ _: 'px24' }} />
      <Flex justifyContent="center" alignItems="center">
        <TextButton use="a" href={getConfigValue(ConfigKey.CookiesPolicyLink)}>
          {t('CookiesManagementModal.findMore')}
        </TextButton>
      </Flex>
    </BaseModal>
  )
}
