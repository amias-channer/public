import React, { useContext, useEffect, useState, useRef } from 'react'
import { Box } from '@revolut/ui-kit'
import styled from 'styled-components'

import {
  AnalyticsContext,
  ChatHeaderContext,
  useHasPendingRequests,
  useIsUnderReview,
} from '../../providers'
import { PreChatBanner } from '../../components/PreChatBanner'
import { useReviewPreChatBanner } from '../../hooks'
import { StatusBannerType } from '../../api/types'
import { AnalyticsEvent } from '../../constants/analytics'

const ScrollableWrapper = styled(Box)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
`

type Props = {
  statusBanners?: StatusBannerType[]
  onContinue: () => void
  onClose: () => void
}

export const PreChatBanners = ({
  statusBanners = [],
  onContinue,
  onClose,
}: Props) => {
  const { setIsChatHeaderVisible } = useContext(ChatHeaderContext)
  setIsChatHeaderVisible(false)
  const hasPendingRequests = useHasPendingRequests()
  const sendChatEvent = useContext(AnalyticsContext)
  const reviewPreChatBanner = useReviewPreChatBanner(hasPendingRequests)
  const isUnderReview = useIsUnderReview()
  const [currentBannerId, setCurrentBannerId] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    wrapperRef.current?.scrollTo(0, 0)
  }, [currentBannerId])

  const banners = [...statusBanners]

  if (isUnderReview) {
    banners.push(reviewPreChatBanner)
  }

  useEffect(() => {
    if (isUnderReview && banners[currentBannerId] === reviewPreChatBanner) {
      if (hasPendingRequests) {
        sendChatEvent({
          type: AnalyticsEvent.PRE_CHAT_BANNER_REQUESTS_PENDING_OPENED,
        })
      } else {
        sendChatEvent({
          type: AnalyticsEvent.PRE_CHAT_BANNER_REQUESTS_SUBMITTED_OPENED,
        })
      }
    } else {
      sendChatEvent({ type: AnalyticsEvent.PRE_CHAT_BANNER })
    }
  }, [hasPendingRequests, sendChatEvent, isUnderReview, currentBannerId]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSecondaryCtaClick = () => {
    sendChatEvent({
      type: AnalyticsEvent.PRE_CHAT_BANNER_SECONDARY_CTA_CLICKED,
    })
    if (currentBannerId < banners.length - 1) {
      setCurrentBannerId(currentBannerId + 1)
    } else {
      onContinue()
    }
  }

  if (!banners[currentBannerId]) {
    return null
  }

  return (
    <ScrollableWrapper ref={wrapperRef} px={2}>
      <PreChatBanner
        banner={banners[currentBannerId]}
        onContinue={onSecondaryCtaClick}
        onClose={() => {
          sendChatEvent({
            type: AnalyticsEvent.PRE_CHAT_BANNER_PRIMARY_CTA_CLICKED,
          })
          onClose()
        }}
      />
    </ScrollableWrapper>
  )
}
