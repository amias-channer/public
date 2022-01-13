import { isEmpty, noop, debounce } from 'lodash'
import qs from 'qs'
import { FC, useEffect, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Box, Text, Search, Header } from '@revolut/ui-kit'

import { RewardsListTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { RewardPartlyDto } from '@revolut/rwa-core-types'
import {
  browser,
  getRewardsHomeUrl,
  getRewardUrl,
  useNavigateToErrorPage,
  getRewardCategoryUrl,
} from '@revolut/rwa-core-utils'

import { RewardsTilesGrid, RewardsLayout } from '../../components'
import { useRewards } from '../../hooks'
import { RewardsCategories, HomeCategoryContent } from './components'

type UrlQueryParams = {
  categoryId?: string
  search?: string
}

export const RewardsHome: FC = () => {
  const { t } = useTranslation(['pages.RewardsHome', 'components.Rewards'])

  const { categoryId: currentCategory, search } = qs.parse(
    browser.getSearch(),
  ) as UrlQueryParams

  const [searchMode, setSearchMode] = useState<boolean>(!isEmpty(search))
  const [searchQuery, setSearchQuery] = useState<string | undefined>(search)
  const [foundRewards, setFoundRewards] = useState<RewardPartlyDto[]>([])

  const {
    isSuccess,
    isError,
    categories,
    getRewardsInCategory,
    getRewardsAmount,
    searchRewards,
  } = useRewards()

  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()

  const rewardsInCategory = useMemo(
    () => (currentCategory ? getRewardsInCategory(currentCategory) : []),
    [currentCategory, getRewardsInCategory],
  )

  const getRewardDetailsUrl = useCallback(
    (rewardId: string) =>
      getRewardUrl(rewardId, { categoryId: currentCategory, search: searchQuery }),
    [currentCategory, searchQuery],
  )

  const doSearch = useCallback(
    (query: string) => {
      if (!searchMode) {
        setSearchMode(true)
      }
      setFoundRewards(searchRewards(query))
    },
    [searchMode, searchRewards],
  )

  const onSearch = debounce((query: string) => {
    setSearchQuery(query)
    history.replace(getRewardsHomeUrl({ search: !isEmpty(query) ? query : undefined }))
    if (isEmpty(query)) {
      setSearchMode(false)
      return
    }
    doSearch(query)
    trackEvent(RewardsListTrackingEvent.searchClicked, {
      search: query,
    })
  }, 300)

  useEffect(() => {
    if (searchQuery) {
      doSearch(searchQuery)
      return
    }

    if (searchMode) {
      setSearchMode(false)
    }
  }, [doSearch, searchMode, searchQuery])

  useEffect(() => {
    if (isError) {
      navigateToErrorPage('Rewards fetch failed')
    }
  }, [navigateToErrorPage, isError])

  useEffect(() => {
    if (!isSuccess) {
      return noop
    }

    trackEvent(RewardsListTrackingEvent.listOpened, {
      perksCount: getRewardsAmount(),
    })

    return () => {
      trackEvent(RewardsListTrackingEvent.listClosed, {
        perksCount: getRewardsAmount(),
      })
    }
  }, [getRewardsAmount, isSuccess])

  const getContent = useCallback(() => {
    if (!isEmpty(rewardsInCategory)) {
      return (
        <Box mt="s-32">
          <RewardsTilesGrid
            rewards={rewardsInCategory}
            getRewardDetailsUrl={getRewardDetailsUrl}
          />
        </Box>
      )
    }

    if (searchMode) {
      if (isEmpty(foundRewards)) {
        return (
          <>
            <Box mt="s-56">
              <Text
                use="h5"
                variant="h5"
                color="rewardsText"
                width="min-content"
                mx="auto"
                whiteSpace="nowrap"
              >
                {t('noSearchResults.title')}
              </Text>
            </Box>
            <Box mt="s-32">
              <Text
                use="p"
                variant="secondary"
                color="rewardsText"
                width="min-content"
                mx="auto"
                whiteSpace="nowrap"
              >
                {t('noSearchResults.subtitle', { query: searchQuery })}
              </Text>
            </Box>
          </>
        )
      }

      return (
        <Box mt="s-32">
          <RewardsTilesGrid
            rewards={foundRewards}
            getRewardDetailsUrl={getRewardDetailsUrl}
          />
        </Box>
      )
    }

    return <HomeCategoryContent />
  }, [foundRewards, getRewardDetailsUrl, rewardsInCategory, searchMode, searchQuery, t])

  const onCategoryClick = (categoryId?: string) => {
    setSearchQuery(undefined)
    setSearchMode(false)
    if (categoryId) {
      trackEvent(RewardsListTrackingEvent.horizontalCategoryClicked, {
        horizontalCategoryId: categoryId,
      })
    }
    history.push(getRewardCategoryUrl(categoryId))
  }

  return (
    <RewardsLayout isLoading={!isSuccess}>
      <Header variant="main">
        <Header.Title>{t('title')}</Header.Title>
      </Header>
      <Search
        placeholder={t('components.Rewards:SearchBar.placeholder')}
        onChange={onSearch}
      />

      <Box mt="s-16">
        <RewardsCategories
          onCategoryClick={onCategoryClick}
          categories={categories}
          currentCategory={currentCategory}
          isSearchActive={searchMode}
        />
      </Box>

      {getContent()}
    </RewardsLayout>
  )
}
