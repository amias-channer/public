import { FC, useMemo, useCallback } from 'react'
import {
  ShevronDownSmall as ShevronDownIcon,
  ShevronUpSmall as ShevronUpIcon,
} from '@revolut/icons'
import { Box, Select, TextBox } from '@revolut/ui-kit'

import { CountryFlag } from '@revolut/rwa-core-components'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { Z_INDICES } from '@revolut/rwa-core-styles'
import { Locale } from '@revolut/rwa-core-types'
import { IconSize } from '@revolut/rwa-core-utils'

import { StyledLabel } from './styled'
import { LanguageSelectorOption, LanguageSelectorProps, RenderLabelArgs } from './types'

const COUNTRY_FLAG_SIZE = 24

const SUPPORTED_LOCALES = getConfigValue<ReadonlyArray<Locale>>(
  ConfigKey.SupportedLocales,
)

const LANGUAGE_SELECTOR_TEST_ID = 'language-selector'

const getSelectedOptionByLabel = (label: string, options: LanguageSelectorOption[]) =>
  options.find((option) => option.label === label)?.countryId ?? ''

export const LanguageSelector: FC<LanguageSelectorProps> = ({
  className,
  locale,
  onChange,
  isUDS,
}) => {
  const options = useMemo(
    () =>
      SUPPORTED_LOCALES.map<LanguageSelectorOption>((item) => ({
        label: item.nativeName,
        value: item.locale,
        countryId: item.countryId,
      })),
    [],
  )

  const renderLabel = useCallback(
    ({ label, isOpen, options: selectOptions }: RenderLabelArgs) => (
      <StyledLabel className={className}>
        <CountryFlag
          size={COUNTRY_FLAG_SIZE}
          country={getSelectedOptionByLabel(label, selectOptions)}
          ml={isUDS ? 12 : 0}
          mr={isUDS ? 14 : 0}
        />
        <TextBox ml="px10" mr="px10" fontSize="smaller">
          {label}
        </TextBox>

        {isOpen ? (
          <ShevronUpIcon size={IconSize.Small} />
        ) : (
          <ShevronDownIcon size={IconSize.Small} />
        )}
      </StyledLabel>
    ),
    [className, isUDS],
  )

  return (
    <Box display="inline-block" data-testid={LANGUAGE_SELECTOR_TEST_ID}>
      <Select
        dropdown={{
          width: 'components.LanguageSelector.dropdown.width',
          fitInAnchor: false,
          zIndex: Z_INDICES.min,
          mb: 'px40',
        }}
        options={options}
        placeholder=""
        placement="top"
        preserveOptionsOrder
        value={locale}
        renderLabel={renderLabel}
        onChange={onChange}
      />
    </Box>
  )
}
