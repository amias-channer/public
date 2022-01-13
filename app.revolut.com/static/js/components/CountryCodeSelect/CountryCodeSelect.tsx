import omit from 'lodash/omit'
import sortBy from 'lodash/sortBy'
import values from 'lodash/values'
import { FC, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { InputSelect, Box, Flex } from '@revolut/ui-kit'

import { Z_INDICES } from '@revolut/rwa-core-styles'
import { Country } from '@revolut/rwa-core-types'
import { COUNTRIES, FlexProp, getPhoneCodeByCountryCode } from '@revolut/rwa-core-utils'
import { useCountryTranslations } from '@revolut/rwa-core-i18n'
import { useCommonConfig } from '@revolut/rwa-core-api'
import { LoaderDots } from '@revolut/rwa-core-components'

import { StyledInputSelect } from './styled'
import { CountryCodeSelectProps, PhoneCodeOption } from './types'
import { useButtonWithInputFocus } from './useButtonWithInputFocus'

// this one is for typeahead functionality
const FIRST_FILTERED_ELEMENT_INDEX = 0

export const CountryCodeSelect: FC<CountryCodeSelectProps> = ({
  inputSelectProps,
  onChange,
}) => {
  const { t } = useTranslation(['components.CountryCodeSelect'])
  const getCountryTranslation = useCountryTranslations()
  const [configData, isConfigFetching] = useCommonConfig()
  const inputRef = useRef<HTMLInputElement>(null)
  const renderDefaultButton = useButtonWithInputFocus(inputRef.current)

  const sortedOptions = useMemo(() => {
    const allowedCountries = omit(COUNTRIES, configData?.blacklistedCountries ?? [])

    const formattedOptions = values<Country>(allowedCountries).map<PhoneCodeOption>(
      (item) => {
        const countryLocalisationLabel = getCountryTranslation({
          countryCode: item.id,
          countryName: item.name,
        })

        return {
          label: `${getPhoneCodeByCountryCode(item.id)} ${countryLocalisationLabel} ${
            item.id
          }`,
          value: item.id,
          countryName: countryLocalisationLabel,
        }
      },
    )

    return sortBy(formattedOptions, 'countryName')
  }, [configData, getCountryTranslation])

  const parseInputValue = (value: string) => {
    if (value.startsWith('+')) {
      const phoneCode = value.split(' ')[0]

      return phoneCode
    }

    return value
  }

  return (
    <StyledInputSelect
      placeholder={t('placeholder')}
      options={sortedOptions}
      variant="filled"
      dropdown={{
        fitInAnchor: false,
        zIndex: Z_INDICES.min,
      }}
      renderOption={(item, select) => (
        <InputSelect.Option key={item.countryName} {...select.getOptionProps(item)}>
          <Flex>
            <Box flex={FlexProp.Auto}>{item.countryName}</Box>
            <Box ml="px24">{getPhoneCodeByCountryCode(item.value as string)}</Box>
          </Flex>
        </InputSelect.Option>
      )}
      renderButton={renderDefaultButton}
      renderLabel={isConfigFetching ? () => <LoaderDots /> : undefined}
      disabled={isConfigFetching}
      defaultHighlightedIndex={FIRST_FILTERED_ELEMENT_INDEX}
      input={{
        ref: inputRef,
        parseFn: parseInputValue,
      }}
      onChange={(value) => onChange?.(value as string)}
      {...inputSelectProps}
    />
  )
}
