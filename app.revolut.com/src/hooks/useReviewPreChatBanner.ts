import { defineMessages, useIntl } from 'react-intl'

import { StatusBannerType } from '../api/types'
import { cdnLink } from '../helpers/assets'

const CHECKLIST_LENS_CDN_IMAGE =
  'business/illustrations-repository/checklist-lens@3x.png'

enum ReviewPreChatBanner {
  REQUESTS_PENDING = 'REQUESTS_PENDING',
  REQUESTS_SUBMITTED = 'REQUESTS_SUBMITTED',
}

const ReviewPreChatBannerTitle = defineMessages({
  [ReviewPreChatBanner.REQUESTS_PENDING]: {
    id: 'supportChat.tickets.reviewRequestsPendingTitle',
    defaultMessage: 'Not sure on what to submit?',
  },
  [ReviewPreChatBanner.REQUESTS_SUBMITTED]: {
    id: 'supportChat.tickets.reviewRequestsSubmittedTitle',
    defaultMessage: 'Your review will soon be completed',
  },
})

const ReviewPreChatBannerContent = defineMessages({
  [ReviewPreChatBanner.REQUESTS_PENDING]: {
    id: 'supportChat.tickets.reviewRequestsPendingDescription',
    defaultMessage: `If you have questions about what to submit, the checklists in your ‘[Requests](request-info)’ section should describe exactly what type of documents we’re looking for.<br /><br />If you need additional assistance, check out our in-app [Help Centre](help-centre). You’ll find more information under ‘Managing my business’ > ‘Verifying details’.<br /><br />If you have an urgent matter to discuss, you can reach us via chat support. We appreciate your patience and understanding.`,
  },
  [ReviewPreChatBanner.REQUESTS_SUBMITTED]: {
    id: 'supportChat.tickets.reviewRequestsSubmittedDescription',
    defaultMessage: `Our team is working around the clock to make sure your account and everyone else’s is secure.<br /><br />You can check your ‘[Requests](request-info)’ section for updates on that status of your review. Check out our in-app [Help Centre](help-centre) if you have questions about what to submit or the process itself.<br /><br />If you have an urgent matter to discuss, you can reach us via chat support. We appreciate your patience and understanding.`,
  },
})

export const useReviewPreChatBanner = (
  hasPendingRequests: boolean
): StatusBannerType => {
  const { formatMessage } = useIntl()

  const reviewPreChatBannerType = hasPendingRequests
    ? ReviewPreChatBanner.REQUESTS_PENDING
    : ReviewPreChatBanner.REQUESTS_SUBMITTED

  return {
    title: formatMessage(ReviewPreChatBannerTitle[reviewPreChatBannerType]),
    content: formatMessage(
      ReviewPreChatBannerContent[reviewPreChatBannerType]
    ).replace(/ {2}/g, '<br /><br />'),
    mainAction: {
      title: formatMessage({
        id: 'supportChat.ticket.gotcha',
        defaultMessage: 'Got it!',
      }),
      link: 'revolut-business://app/help-centre',
    },
    secondaryAction: {
      title: formatMessage({
        id: 'supportChat.ticket.chatWithUs',
        defaultMessage: 'Chat with us',
      }),
      link: 'revolut-business://app/chat',
    },
    image: cdnLink(CHECKLIST_LENS_CDN_IMAGE),
  }
}
