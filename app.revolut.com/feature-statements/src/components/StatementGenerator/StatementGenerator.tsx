import { VFC, useCallback, useState, useEffect, useContext } from 'react'
import {
  Box,
  Button,
  Flex,
  Header,
  Layout,
  TabBar,
  ThemeProvider,
  UnifiedTheme,
} from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'
import { lastDayOfMonth } from 'date-fns'

import { StatementFormat } from '@revolut/rwa-core-types'
import { Spacer, useModal } from '@revolut/rwa-core-components'
import {
  isDateCurrentMonth,
  showNotification,
  requestNotificationPermission,
} from '@revolut/rwa-core-utils'

import { QueryParamsFactoryArgs, StatementUrl } from '../../types'
import { StatementsContext } from '../StatementsProvider'
import { StatementFootnote } from './styled'
import { ErrorPopup, StatementPendingPopup } from './popups'
import { CalendarInput } from './CalendarInput'
import { firstDayOfCurrentMonth, formatDate } from './utils'

type DateRange = {
  from: Date
  to: Date
}

export type StatementGeneratorProps = {
  availableDatesRange: DateRange
  currency?: string
  isCSVAvailable?: boolean
  statementFetchUrl: StatementUrl
  queryParamsFactory: (params: QueryParamsFactoryArgs) => Object
  onBackButtonClick: VoidFunction
  onDownload?: VoidFunction
  onError?: VoidFunction
}

const STATEMENT_FORMATS = [StatementFormat.Pdf, StatementFormat.Csv]

const STATEMENT_TABS = {
  [StatementFormat.Pdf]: 'PDF',
  [StatementFormat.Csv]: 'Excel',
}

export const STATEMENT_BACK_BUTTON_LABEL = 'Back from statement'

const getTodayDate = () => new Date()

export const StatementGenerator: VFC<StatementGeneratorProps> = ({
  availableDatesRange,
  currency,
  isCSVAvailable,
  statementFetchUrl,
  queryParamsFactory,
  onBackButtonClick,
  onDownload,
  onError,
}) => {
  const { t } = useTranslation('components.StatementGenerator')
  const [selectedTab, setSelectedTab] = useState(StatementFormat.Pdf)
  const [showErrorPopup, errorPopupProps] = useModal()
  const [showStatementPendingPopup, statementPendingPopupProps] = useModal()
  const [startDate, setStartDate] = useState<Date>(firstDayOfCurrentMonth())
  const [endDate, setEndDate] = useState<Date>(getTodayDate())

  const {
    isFetching,
    isPreparing,
    isReady,
    isToastOpen,
    hasError,
    downloadStatement,
    generateStatement,
    onPendingPopupOpen,
    showToast,
  } = useContext(StatementsContext)

  useEffect(() => {
    if (hasError) {
      showErrorPopup()
    }
  }, [hasError, showErrorPopup])

  useEffect(() => {
    if (isPreparing && !isToastOpen) {
      showStatementPendingPopup()
    }
  }, [isPreparing, isToastOpen, showStatementPendingPopup])

  const handleNotificationClick = useCallback(
    (notification: Notification, notificationEvent: Event) => {
      notificationEvent.preventDefault()
      notification.close()
      downloadStatement()
    },
    [downloadStatement],
  )

  useEffect(() => {
    if (isReady) {
      showNotification({
        title: t('notification.title', { currency }),
        body: t('notification.body'),
        clickAction: handleNotificationClick,
      })
    }
  }, [isReady, handleNotificationClick, currency, t])

  useEffect(() => {
    if (statementPendingPopupProps.isOpen) {
      requestNotificationPermission()
      onPendingPopupOpen()
    }
  }, [onPendingPopupOpen, statementPendingPopupProps.isOpen])

  const handlePendingStatementClose = useCallback(() => {
    statementPendingPopupProps.onRequestClose()
    showToast()
  }, [showToast, statementPendingPopupProps])

  const handleStartDateChange = (date: Date) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date: Date) => {
    if (isDateCurrentMonth(date)) {
      setEndDate(getTodayDate())
    } else {
      setEndDate(lastDayOfMonth(date))
    }
  }

  const handleGenerateClick = () => {
    generateStatement({
      fetchUrl: statementFetchUrl,
      queryParams: queryParamsFactory({
        dateFrom: formatDate(startDate),
        dateTo: formatDate(endDate),
        format: selectedTab,
      }),
      onDownload,
      onError,
    })
  }

  const isLoadingState = isFetching || isPreparing

  return (
    <ThemeProvider theme={UnifiedTheme}>
      <Layout>
        <Layout.Main>
          <Header variant="form">
            <Header.BackButton
              aria-label={STATEMENT_BACK_BUTTON_LABEL}
              onClick={onBackButtonClick}
            />
            <Header.Title>{t('title', { currency })}</Header.Title>
          </Header>
          {isCSVAvailable && (
            <TabBar variant="segmented">
              {STATEMENT_FORMATS.map((tab) => (
                <TabBar.Item
                  key={tab}
                  use="button"
                  aria-selected={selectedTab === tab}
                  onClick={() => setSelectedTab(tab)}
                >
                  {STATEMENT_TABS[tab]}
                </TabBar.Item>
              ))}
            </TabBar>
          )}
          <Spacer h="s-16" />
          <Flex>
            <CalendarInput
              dateValue={startDate}
              title={t('CalendarInput.startDate.title')}
              from={availableDatesRange.from}
              to={endDate}
              onDateChange={handleStartDateChange}
            />
            <Box pl="s-16" />
            <CalendarInput
              dateValue={endDate}
              title={t('CalendarInput.endDate.title')}
              from={startDate}
              to={availableDatesRange.to}
              onDateChange={handleEndDateChange}
            />
          </Flex>
          <StatementFootnote>{t('footerText')}</StatementFootnote>
        </Layout.Main>
        <Layout.Actions>
          <Button
            pending={isLoadingState}
            disabled={isLoadingState}
            elevated
            onClick={handleGenerateClick}
          >
            {t('buttonText')}
          </Button>
        </Layout.Actions>
      </Layout>
      <ErrorPopup {...errorPopupProps} onClick={handleGenerateClick} />
      <StatementPendingPopup
        {...statementPendingPopupProps}
        onRequestClose={handlePendingStatementClose}
      />
    </ThemeProvider>
  )
}
