import { FC } from 'react'
import {
  Button,
  ButtonVariant,
  Carousel,
  Color,
  Header,
  Skeleton,
  Sticky,
} from '@revolut/ui-kit'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { useLocale } from '@revolut/rwa-core-i18n'
import { Z_INDICES } from '@revolut/rwa-core-styles'
import { TransactionDto } from '@revolut/rwa-core-types'
import { getHomeUrl } from '@revolut/rwa-core-utils'

import { getMonthsOptions } from './getMonthsOptions'

type Props = {
  transactions: TransactionDto[]
  createdDate: number
  canFetchMore: boolean
  currentMonth?: Date
  isLoading?: boolean
  accountId?: string
  onMonthClick: (month: Date) => void
}

export const SCROLL_TO_MONTH_BUTTON_TESTID = 'scroll-to-month-button-testid'

export const TransactionsListHeader: FC<Props> = ({
  accountId,
  isLoading,
  currentMonth,
  transactions,
  canFetchMore,
  createdDate,
  onMonthClick,
}) => {
  const { locale } = useLocale()

  const { t } = useTranslation('pages.TransactionsList')

  const history = useHistory()

  const monthsOptions = getMonthsOptions(
    transactions,
    createdDate,
    Boolean(canFetchMore),
    locale,
  )

  const getCurrentMonthIndex = (month: Date) =>
    monthsOptions.findIndex((option) => option.value.getTime() === month.getTime())

  const onItemClick = (value: Date) => () => {
    onMonthClick(value)
  }

  const onBackClick = () => {
    history.push(getHomeUrl({ tab: 'accounts', queryParams: { accountId } }))
  }

  return (
    <>
      <Header variant="form">
        <Header.BackButton aria-label="Back" onClick={onBackClick} />
        <Header.Title>{t('header.title')}</Header.Title>
      </Header>
      <Sticky width="100%" top={55} backgroundColor="grey-2" zIndex={Z_INDICES.min}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {!isEmpty(transactions) && (
              <Carousel
                align="center"
                index={currentMonth ? getCurrentMonthIndex(currentMonth) : undefined}
                mb="s-16"
              >
                {monthsOptions.map(({ label, value }) => {
                  const isActive = value.getTime() === currentMonth?.getTime()
                  return (
                    <Carousel.Item key={label}>
                      <Button
                        data-testid={SCROLL_TO_MONTH_BUTTON_TESTID}
                        onClick={onItemClick(value)}
                        variant={isActive ? ButtonVariant.WHITE : ButtonVariant.TEXT}
                        color={isActive ? '' : Color.GREY_50}
                        size="sm"
                      >
                        {label}
                      </Button>
                    </Carousel.Item>
                  )
                })}
              </Carousel>
            )}
          </>
        )}
      </Sticky>
    </>
  )
}
