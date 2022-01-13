import React, { FC } from 'react'
import { useSelector } from 'react-redux'

import { StateType } from '../../redux/reducers'
import { HELP_CENTRE_URL } from '../../constants/links'
import { useSendChatEvent } from '../../providers'

import { QuestionsKey, QuestionText, LINKS_FOR_QUESTIONS } from './faqConfig'
import { Link, SmartFAQContainer, Header } from './styles'

const SMART_FAQ_CLICKED_EVENT = 'Smart faq link clicked'

export const topFiveSmartFaq = (faqRanks: object) => {
  if (!faqRanks) {
    return null
  }

  const sortedEntries = Object.entries(faqRanks).sort(
    ([_, firstCount], [__, secondCount]) =>
      (secondCount as number) - (firstCount as number)
  )

  return sortedEntries.splice(0, 5)
}

export const SmartFaq: FC<{ faqRanks: object }> = ({ faqRanks }) => {
  const sendChatEvent = useSendChatEvent()
  const smartFaq = topFiveSmartFaq(faqRanks)
  const { clientId } = useSelector((state: StateType) => state.auth)

  if (!smartFaq || !smartFaq.length) {
    return null
  }

  const sendEvent = (name: QuestionsKey, rightClick: boolean = false) =>
    sendChatEvent({
      type: SMART_FAQ_CLICKED_EVENT,
      params: { name, clientId, rightClick },
    })

  return (
    <SmartFAQContainer>
      <Header>Select an issue</Header>
      {smartFaq.map(([name]) =>
        LINKS_FOR_QUESTIONS[name as QuestionsKey] ? (
          <Link
            href={`${HELP_CENTRE_URL}${
              LINKS_FOR_QUESTIONS[name as QuestionsKey]
            }`}
            target='_blank'
            rel='noreferrer noopener'
            key={name}
            onClick={() => sendEvent(name as QuestionsKey)}
            onContextMenu={() => sendEvent(name as QuestionsKey, true)}
          >
            {QuestionText[name as QuestionsKey]}
          </Link>
        ) : null
      )}
    </SmartFAQContainer>
  )
}
