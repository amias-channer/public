import React, { FC, useEffect, useMemo, useState } from 'react'
import Infinite from 'react-infinite'
import { useWindowHeight } from '@react-hook/window-size'
import { Box, Group, Item, Search } from '@revolut/ui-kit'

import {
  useMoveToTheNextView,
  useSetIsContinueButtonVisible,
} from '../../../providers/FlowContext'
import { Country, CountryInputItem, StringValue } from '../../../types'
import { includesSubstringCaseInsensitive } from '../../helpers'
import { FALLBACK_COUNTRIES } from '../common/constants/fallbackCountries'
import CountryFlag from '../common/CountryFlag/CountryFlag'
import { useDebouncedSearch } from '../common/hooks/useDebouncedSearch'

const ELEMENT_HEIGHT = 76
const CONTAINER_HEIGHT_DELTA = 285

const searchCountries = (countries: Country[], filterValue: string) =>
  countries.filter(country =>
    includesSubstringCaseInsensitive(country.description, filterValue),
  )

type Props = Pick<CountryInputItem, 'countries' | 'searchHint'> & {
  disabled: boolean
  required: boolean
  changeValue: (value: StringValue['value']) => void
}

const CountryInput: FC<Props> = ({
  countries = FALLBACK_COUNTRIES,
  searchHint,
  disabled,
  required,
  changeValue,
}) => {
  const [isMoveToTheNextViewPending, setIsMoveToTheNextViewPending] = useState(false)
  const moveToTheNextView = useMoveToTheNextView()
  const setIsContinueButtonVisible = useSetIsContinueButtonVisible()
  const windowHeight = useWindowHeight()

  const { filterInputValue, filteredItems, debouncedSearch } = useDebouncedSearch<
    Country
  >(countries, searchCountries)

  useEffect(() => {
    // Do move after the state got updated.
    if (isMoveToTheNextViewPending) {
      moveToTheNextView()
      setIsMoveToTheNextViewPending(false)
    }
    if (required) {
      setIsContinueButtonVisible(false)
    }
    return () => {
      setIsContinueButtonVisible(true)
    }
  }, [
    isMoveToTheNextViewPending,
    moveToTheNextView,
    required,
    setIsContinueButtonVisible,
  ])

  const listHeight = useMemo(
    () =>
      Math.min(
        windowHeight - CONTAINER_HEIGHT_DELTA,
        filteredItems.length * ELEMENT_HEIGHT,
      ),
    [filteredItems.length, windowHeight],
  )

  return (
    <>
      <Box mb="s-16">
        <Search
          value={filterInputValue}
          placeholder={searchHint || 'Search country'}
          onChange={debouncedSearch}
        />
      </Box>
      <Group>
        {filteredItems.length > 0 && (
          <Infinite containerHeight={listHeight} elementHeight={ELEMENT_HEIGHT}>
            {filteredItems.map(({ code, description }) => (
              <Item
                key={code}
                use="button"
                disabled={disabled}
                onClick={() => {
                  changeValue(code)
                  setIsMoveToTheNextViewPending(true)
                }}
              >
                <Item.Avatar>
                  <CountryFlag countryCode={code} />
                </Item.Avatar>
                <Item.Content>
                  <Item.Title>{description}</Item.Title>
                </Item.Content>
              </Item>
            ))}
          </Infinite>
        )}
      </Group>
    </>
  )
}

export default CountryInput
