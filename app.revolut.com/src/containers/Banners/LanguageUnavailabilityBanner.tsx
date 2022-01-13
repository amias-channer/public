/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { TextBox, TransitionCollapse } from '@revolut/ui-kit'

import {
  currentTicketLanguageAvailabilitySelector,
  currentTicketSelector,
} from '../../redux/selectors/tickets'
import {
  changeTicketLanguageToEnglish,
  checkTicketLanguageAvailability,
  resolveTicket,
} from '../../redux/reducers/tickets'
import { AnalyticsContext } from '../../providers'
import { ActionButton } from '../../components/ActionButton'

import { LocalSupportBanner } from './styles'
import { BannerTimer } from './BannerTimer'
import { AnalyticsEvent } from '../../constants/analytics'

const NEW_TICKET_ID = 'new'
const ENGLISH_CHAT_LANGUAGE = 'en'
const MAX_AVAILABILITY_CALLS = 12
const LANGUAGE_SWITCHER_INTERVAL_MS = 10000

type Props = {
  redirectPath: string
}

export const LanguageUnavailabilityBanner = ({ redirectPath }: Props) => {
  const dispatch = useDispatch()
  const sendChatEvent = useContext(AnalyticsContext)
  const [isLanguageChanged, setIsLanguageChanged] = useState(false)
  const [
    isLanguageChangedAutomatically,
    setIsLanguageChangedAutomatically,
  ] = useState(false)
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false)
  const [
    languageAvailabilityTimesCalled,
    setLanguageAvailabilityTimesCalled,
  ] = useState(0)
  const [
    languageAvailabilityTimeout,
    setLanguageAvailabilityTimeout,
  ] = useState(1000)

  const languageAvailability = useSelector(
    currentTicketLanguageAvailabilitySelector
  )
  const ticket = useSelector(currentTicketSelector)
  const { assigned, id: ticketId } = ticket || {}

  const isBannerVisible =
    !assigned &&
    languageAvailability &&
    languageAvailability.supportLanguage !== ENGLISH_CHAT_LANGUAGE &&
    !languageAvailability.active

  useEffect(() => {
    if (isBannerVisible) {
      sendChatEvent({ type: AnalyticsEvent.LANG_AVAILABILITY_BANNER_OPENED })
    }
  }, [isBannerVisible])

  useEffect(() => {
    if (ticketId && ticketId !== NEW_TICKET_ID) {
      // chat language is being updated with small delay, without this timeout we would always get english as chat language
      // also the delay can be extended due to heavy load on backend so we will be trying few times before we settle that this is indeed English chat
      setTimeout(() => {
        if (
          languageAvailabilityTimesCalled < MAX_AVAILABILITY_CALLS &&
          (!languageAvailability ||
            languageAvailability.supportLanguage === ENGLISH_CHAT_LANGUAGE) &&
          !assigned
        ) {
          dispatch(checkTicketLanguageAvailability(ticketId as string))
          setLanguageAvailabilityTimesCalled(
            languageAvailabilityTimesCalled + 1
          )
          if (languageAvailabilityTimeout < 60000) {
            setLanguageAvailabilityTimeout(languageAvailabilityTimeout * 2)
          }
        }
      }, languageAvailabilityTimeout)
    }
  }, [ticketId, languageAvailabilityTimesCalled])

  const fallbackToEnglish = () => {
    sendChatEvent({ type: AnalyticsEvent.LANG_AVAILABILITY_BANNER_TO_ENG })
    dispatch(
      changeTicketLanguageToEnglish(ticketId as string, () => {
        setIsLanguageChanged(true)
        setIsSuccessMessageVisible(true)
        dispatch(checkTicketLanguageAvailability(ticketId as string))
      })
    )
  }

  const fallbackToEnglishAutomatically = () => {
    setIsLanguageChangedAutomatically(true)
    fallbackToEnglish()
  }

  const goToHelpCentre = () => {
    sendChatEvent({
      type: AnalyticsEvent.LANG_AVAILABILITY_BANNER_TO_HELP_CENTRE,
    })
    dispatch(resolveTicket(ticketId as string))
    document.location.href = redirectPath
  }

  return (
    <>
      <TransitionCollapse
        in={isSuccessMessageVisible && isLanguageChanged && !assigned}
      >
        <LocalSupportBanner>
          <BannerTimer onElapsed={() => setIsSuccessMessageVisible(false)} />
          <TextBox fontWeight={500} mb={1}>
            {isLanguageChangedAutomatically ? (
              <FormattedMessage
                id='supportChat.ticket.switchedToEnglishTitle'
                defaultMessage='Switched to English'
              />
            ) : (
              <FormattedMessage
                id='supportChat.ticket.gotcha'
                defaultMessage='Got it!'
              />
            )}
          </TextBox>
          <TextBox variant='secondary' color='grey-35' mt={1}>
            {isLanguageChangedAutomatically ? (
              <FormattedMessage
                id='supportChat.ticket.switchedToEnglishDescription'
                defaultMessage='If you feel uncomfortable speaking English just let our agent know about it.'
              />
            ) : (
              <FormattedMessage
                id='supportChat.ticket.weWillRedirectYouToEnglish'
                defaultMessage='We’ll redirect you to an English speaking support agent for this chat.'
              />
            )}
          </TextBox>
        </LocalSupportBanner>
      </TransitionCollapse>

      <TransitionCollapse in={isBannerVisible && !isLanguageChanged}>
        <LocalSupportBanner>
          <BannerTimer
            interval={LANGUAGE_SWITCHER_INTERVAL_MS}
            onElapsed={fallbackToEnglishAutomatically}
          />
          <TextBox fontWeight={500} mt={2}>
            <FormattedMessage
              id='supportChat.ticket.switchToEnglish'
              defaultMessage='Switch to English?'
            />
          </TextBox>
          <TextBox variant='secondary' color='grey-35' my={1}>
            <FormattedMessage
              id='supportChat.ticket.supportInYourLanguageIsOffline'
              defaultMessage='Support in your language is temporarily unavailable. Would you like to chat with an English speaking support agent?'
            />
          </TextBox>
          <ActionButton mt={2} variant='primary' onClick={fallbackToEnglish}>
            <FormattedMessage
              id='supportChat.ticket.yesSwitchToEnglish'
              defaultMessage='Yes, chat in English'
            />
          </ActionButton>
          <ActionButton
            mt={2}
            mb={1}
            variant='secondary'
            onClick={goToHelpCentre}
          >
            <FormattedMessage
              id='supportChat.ticket.goToHelpCentre'
              defaultMessage='No, go to Help Centre'
            />
          </ActionButton>
        </LocalSupportBanner>
      </TransitionCollapse>
    </>
  )
}
