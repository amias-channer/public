import copy from 'copy-to-clipboard'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Sticky } from '@revolut/ui-kit'

import { trackEvent, RewardTrackingEvent } from '@revolut/rwa-core-analytics'

import { useReward } from '../../../../hooks'
import { GoToButton } from './styled'

type Props = {
  rewardId: string
  url: string
  merchantName: string
  copyPromoCode?: string
}

export const EVENT_VOUCHER_SOURCE = 'SinglePerk'

export const GoToMerchantButton: FC<Props> = ({
  rewardId,
  url,
  merchantName,
  copyPromoCode,
}) => {
  const { redeem } = useReward(rewardId)
  const { t } = useTranslation('pages.RewardDetails')

  const onClick = () => {
    if (copyPromoCode) {
      copy(copyPromoCode)
      trackEvent(RewardTrackingEvent.voucherCodeCopied, {
        source: EVENT_VOUCHER_SOURCE,
        perkId: rewardId,
        promoCode: copyPromoCode,
      })
    }
    redeem()
    trackEvent(RewardTrackingEvent.webhookClicked, {
      perkId: rewardId,
      url,
    })
  }

  return (
    <Sticky bottom="s-24">
      <GoToButton href={url} onClick={onClick}>
        {copyPromoCode
          ? t('GoToMerchantButton.copyAndRedeemText')
          : t('GoToMerchantButton.takeMeToMerchantText', { merchantName })}
      </GoToButton>
    </Sticky>
  )
}
