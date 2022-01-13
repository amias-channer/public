import React, { useState } from "react"
import { isNil } from "lodash"
import { useUpdateEffect } from "react-use"
import { Avatar, AvatarProps } from "../../../design-system/Avatar"
import Block from "../../../design-system/Block"
import Flex from "../../../design-system/Flex"
import Select from "../../../design-system/Select"
import SpaceBetween from "../../../design-system/SpaceBetween"
import Text from "../../../design-system/Text"
import { useTranslations } from "../../../hooks/useTranslations"
import { trackApplyPriceFilter } from "../../../lib/analytics/events/searchEvents"
import { PriceFilterType } from "../../../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { bn, padEndZeros } from "../../../lib/helpers/numberUtils"
import { HUES } from "../../../styles/themes"
import ActionButton from "../../common/ActionButton.react"
import VerticalAligned from "../../common/VerticalAligned.react"
import NumericInput from "../../forms/NumericInput.react"
import { InputFrame } from "../../layout/Frame.react"
import Panel from "../../layout/Panel.react"

interface Props {
  priceFilter?: PriceFilterType
  setPriceFilter: (priceFilter: PriceFilterType) => unknown
}

const avatarProps: AvatarProps = {
  backgroundColor: "white",
  outline: 4,
  size: 16,
}

const PRICE_FILTERS = [
  {
    value: "USD",
    label: "United States Dollar (USD)",
    avatar: {
      ...avatarProps,
      icon: "attach_money",
      color: "gray",
    },
  },
  {
    value: "ETH",
    label: "Ether (ETH)",
    avatar: {
      ...avatarProps,
      src: "https://lh3.googleusercontent.com/7hQyiGtBt8vmUTq4T0aIUhIhT00dPhnav87TuFQ5cLtjlk724JgXdjQjoH_CzYz-z37JpPuMFbRRQuyC7I9abyZRKA",
    },
  },
] as const

type PriceFilterOption = typeof PRICE_FILTERS[number]

const priceFilterText = ({ symbol, min, max }: PriceFilterType) => {
  if (!isNil(min) && !isNil(max)) {
    return `${symbol}: ${padEndZeros(min, 2)} - ${padEndZeros(max, 2)}`
  } else if (!isNil(min)) {
    return `${symbol}: > ${padEndZeros(min, 2)}`
  } else if (!isNil(max)) {
    return `${symbol}: < ${padEndZeros(max, 2)}`
  }
  return undefined
}

export const priceFilterLabel = (priceFilter: PriceFilterType) => {
  const option = PRICE_FILTERS.find(f => f.value === priceFilter.symbol)
  const avatar = option?.avatar && (
    <Block marginRight="8px">
      <Avatar {...option.avatar} />
    </Block>
  )

  return (
    <Flex>
      {avatar}
      <VerticalAligned>{priceFilterText(priceFilter)}</VerticalAligned>
    </Flex>
  )
}

export const PriceFilter = ({ priceFilter, setPriceFilter }: Props) => {
  const { tr } = useTranslations()
  const [symbol, setSymbol] = useState<PriceFilterOption | undefined>(
    () =>
      PRICE_FILTERS.find(f => f.value === priceFilter?.symbol) ??
      PRICE_FILTERS[0],
  )

  const [minInputValue, setMinInputValue] = useState<string | undefined>(
    String(!isNil(priceFilter?.min) ? padEndZeros(priceFilter!.min, 2) : ""),
  )
  const [min, setMin] = useState(minInputValue ?? "")

  const [maxInputValue, setMaxInputValue] = useState<string | undefined>(
    String(!isNil(priceFilter?.max) ? padEndZeros(priceFilter!.max, 2) : ""),
  )
  const [max, setMax] = useState(maxInputValue ?? "")
  const invalid = !!min && !!max && bn(min).gt(max)
  const apply = () => {
    if (!symbol || invalid) {
      return
    }

    const nextPriceFilter: PriceFilterType = {
      symbol: symbol.value,
      min: min ? Number(min) : undefined,
      max: max ? Number(max) : undefined,
    }

    if (JSON.stringify(nextPriceFilter) === JSON.stringify(priceFilter)) {
      return
    }

    const sanitizedMin = min ? padEndZeros(min, 2) : undefined
    if (sanitizedMin && sanitizedMin !== min) {
      setMinInputValue(sanitizedMin)
      setMin(sanitizedMin)
    }

    const sanitizedMax = max ? padEndZeros(max, 2) : undefined
    if (sanitizedMax && sanitizedMax !== max) {
      setMaxInputValue(sanitizedMax)
      setMax(sanitizedMax)
    }

    trackApplyPriceFilter({ symbol: symbol.value })
    setPriceFilter(nextPriceFilter)
  }

  const cleanup = () => {
    setSymbol(PRICE_FILTERS[0])
    setMinInputValue("")
    setMin("")
    setMaxInputValue("")
    setMax("")
  }

  // Cleanup if filter is removed
  useUpdateEffect(() => {
    if (!priceFilter) {
      cleanup()
    }
  }, [priceFilter])

  return (
    <>
      <Panel mode="start-open" title={tr("Price")}>
        <Select
          clearable={false}
          options={PRICE_FILTERS}
          readOnly
          startEnhancer={symbol?.avatar && <Avatar {...symbol.avatar} />}
          value={symbol}
          onSelect={setSymbol}
        />

        <SpaceBetween marginTop="16px">
          <Block width="calc(50% - 15px)">
            <InputFrame>
              <NumericInput
                inputValue={min}
                placeholder="Min"
                value={minInputValue}
                onChange={({ inputValue, value }) => {
                  setMin(inputValue)
                  setMinInputValue(value)
                }}
              />
            </InputFrame>
          </Block>
          <VerticalAligned padding="0 8px">to</VerticalAligned>
          <Block width="calc(50% - 15px)">
            <InputFrame>
              <NumericInput
                inputValue={max}
                placeholder="Max"
                value={maxInputValue}
                onChange={({ inputValue, value }) => {
                  setMax(inputValue)
                  setMaxInputValue(value)
                }}
              />
            </InputFrame>
          </Block>
        </SpaceBetween>

        {invalid ? (
          <Block marginTop="16px">
            <Text color={HUES.coral} fontSize="12px" fontWeight="500">
              Minimum must be less than maximum
            </Text>
          </Block>
        ) : null}

        <Block marginTop="16px" width="calc(50% - 15px)">
          <ActionButton
            isDisabled={!symbol || (!min && !max) || invalid}
            style={{ width: "100%" }}
            type="secondary"
            onClick={apply}
          >
            {tr("Apply")}
          </ActionButton>
        </Block>
      </Panel>
    </>
  )
}

export default PriceFilter
