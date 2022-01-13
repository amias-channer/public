import { VFC, useState, useMemo } from 'react'
import { FilterButton, Popup, Group, Item, Bar } from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'

import { TopMoversTimeSpan } from '@revolut/rwa-core-types'

import { TopMoverType } from '../../../hooks'

import { MoversFilter } from './types'

type Props = {
  onChange: (filter: MoversFilter) => void
  filter?: MoversFilter
}

type OptionItem<T> = {
  value: T
  label: string
}

export const TopMoversFilter: VFC<Props> = ({ filter, onChange }) => {
  const { t } = useTranslation('pages.CryptoTopMovers')

  const topMoversTypeItems: OptionItem<TopMoverType>[] = useMemo(
    () => [
      { value: TopMoverType.All, label: t('moversFilterTypeOption.all') },
      { value: TopMoverType.Gainers, label: t('moversFilterTypeOption.topGainers') },
      { value: TopMoverType.Losers, label: t('moversFilterTypeOption.topLosers') },
    ],
    [t],
  )

  const topMoversTimeRanges: OptionItem<TopMoversTimeSpan>[] = useMemo(
    () => [
      {
        value: TopMoversTimeSpan.OneDay,
        label: t('moversFilterTimeRangeOption.oneDay'),
      },
      {
        value: TopMoversTimeSpan.OneWeek,
        label: t('moversFilterTimeRangeOption.oneWeek'),
      },
      {
        value: TopMoversTimeSpan.OneMonth,
        label: t('moversFilterTimeRangeOption.oneMonth'),
      },
      {
        value: TopMoversTimeSpan.OneYear,
        label: t('moversFilterTimeRangeOption.oneYear'),
      },
      {
        value: TopMoversTimeSpan.FiveYears,
        label: t('moversFilterTimeRangeOption.fiveYears'),
      },
    ],
    [t],
  )

  const [topMoverType, setTopMoverType] = useState<OptionItem<TopMoverType>>(
    topMoversTypeItems.find((moverItem) => moverItem.value === filter?.moverType) ??
      topMoversTypeItems[0],
  )
  const [timeSpan, setTimeSpan] = useState<OptionItem<TopMoversTimeSpan>>(
    topMoversTimeRanges.find((dateRange) => dateRange.value === filter?.timeSpan) ??
      topMoversTimeRanges[0],
  )
  const [isTopMoverModalOpened, setIsTopMoverOpened] = useState<boolean>(false)
  const [isTimeRangeModalOpened, setIsTimeRangeModalOpened] = useState<boolean>(false)

  const onFilterChanged = (newFilterValue: MoversFilter) => {
    setIsTopMoverOpened(false)
    setIsTimeRangeModalOpened(false)
    onChange(newFilterValue)
  }

  const onMoversTypeChange = (newMoverItem: OptionItem<TopMoverType>) => () => {
    const newFilterValue = {
      timeSpan: timeSpan.value,
      moverType: newMoverItem.value,
    }
    setTopMoverType(newMoverItem)
    onFilterChanged(newFilterValue)
  }

  const onTimeRangeChange = (newTimeSpan: OptionItem<TopMoversTimeSpan>) => () => {
    const newFilterValue = {
      timeSpan: newTimeSpan.value,
      moverType: topMoverType.value,
    }
    setTimeSpan(newTimeSpan)
    onFilterChanged(newFilterValue)
  }

  return (
    <>
      <Bar>
        <FilterButton
          sizes="sm"
          useIcon={Icons.Menu}
          onClick={() => setIsTopMoverOpened(true)}
        >
          {topMoverType.label}
        </FilterButton>
        <FilterButton
          sizes="sm"
          useIcon={Icons.Menu}
          onClick={() => setIsTimeRangeModalOpened(true)}
        >
          {timeSpan.label}
        </FilterButton>
      </Bar>
      <Popup
        isOpen={isTopMoverModalOpened}
        onExit={() => setIsTopMoverOpened(false)}
        variant="bottom-sheet"
      >
        <Group>
          {topMoversTypeItems.map((topMoverItem) => (
            <Item
              key={topMoverItem.value}
              use="button"
              variant="choice"
              aria-pressed={topMoverType === topMoverItem}
              onClick={onMoversTypeChange(topMoverItem)}
            >
              {topMoverItem.label}
            </Item>
          ))}
        </Group>
      </Popup>
      <Popup
        isOpen={isTimeRangeModalOpened}
        onExit={() => setIsTimeRangeModalOpened(false)}
        variant="bottom-sheet"
      >
        <Group>
          {topMoversTimeRanges.map((timeRange) => (
            <Item
              key={timeRange.value}
              use="button"
              variant="choice"
              aria-pressed={timeSpan === timeRange}
              onClick={onTimeRangeChange(timeRange)}
            >
              {timeRange.label}
            </Item>
          ))}
        </Group>
      </Popup>
    </>
  )
}
