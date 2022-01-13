import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Cell } from '@revolut/ui-kit'

import {
  trackEvent,
  RewardTrackingEvent,
  useTrackEventWhenElementIsVisible,
} from '@revolut/rwa-core-analytics'

type Props = {
  termsUrl: string
  rewardId: string
}

export const TermsAndConds: FC<Props> = ({ termsUrl, rewardId }) => {
  const { t } = useTranslation('pages.RewardDetails')
  const ref = useRef<HTMLDivElement>(null)

  useTrackEventWhenElementIsVisible(ref, RewardTrackingEvent.termsAncConditionsViewed, {
    perkId: rewardId,
  })

  const onClick = () => {
    trackEvent(RewardTrackingEvent.termsAncConditionsClicked, {
      perkId: rewardId,
    })
  }

  return (
    <Cell
      use="a"
      href={termsUrl}
      target="_blank"
      variant="disclosure"
      onClick={onClick}
      ref={ref}
    >
      {t('TermsAndConditions.titleButton')}
    </Cell>
  )
}
