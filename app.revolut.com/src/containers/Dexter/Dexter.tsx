import React, { FC, useMemo, useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Box } from '@revolut/ui-kit'
import { FormWidget } from 'revolut-forms'
import {
  getRawFormFlow,
  DexterForm,
  DexterFormField,
} from '../../constants/dexter'

import {
  useHideChatHeader,
  useSendChatEvent,
  useStatusBanners,
  useIsUnderReview,
} from '../../providers'
import { useForm, useTicketCreate, useDescriptionCache } from './hooks'
import { getValuesFromStaticForm } from '../../helpers/forms'
import { DexterSuggestion } from '../../api/types'

import { PreChatBanners } from '../Banners/PreChatBanners'
import { DexterResponseBanner, LoadScreen } from '../../components'

const ScrollableWrapper = styled(Box)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 16px 16px 0;
`

type Props = {
  fetchPrechatSuggestion: (query: string) => Promise<DexterSuggestion>
  closeChat: () => void
}

export const Dexter: FC<Props> = ({ fetchPrechatSuggestion, closeChat }) => {
  const { formatMessage } = useIntl()
  useHideChatHeader()
  const { getDesc, setDesc, clearDesc } = useDescriptionCache()
  const sendChatEvent = useSendChatEvent()
  const staticFlowId = useMemo(() => uuid(), [])
  const preDescription = getDesc()
  const rawForm = useMemo(() => getRawFormFlow(preDescription, formatMessage), [
    formatMessage,
    preDescription,
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isPreChatBanner, setIsPreChatBanner] = useState(true)
  const [resultBanner, setResultBanner] = useState<DexterSuggestion | null>(
    null
  )
  const banners = useStatusBanners()
  const isUnderReview = useIsUnderReview()

  const [formAnswers, setFormAnswers] = useState<DexterForm | null>(null)
  const { api } = useForm(staticFlowId, rawForm)
  const createTicket = useTicketCreate()

  const onFlowComplete = useCallback(
    async ({ response }) => {
      const answers = getValuesFromStaticForm(response) as DexterForm
      const description = answers?.[DexterFormField.DESCRIPTION].value.value
      setFormAnswers(answers)
      setDesc(description)
      setIsLoading(true)
      sendChatEvent({
        type: 'dexter submit',
        params: {
          query: description,
        },
      })
      try {
        const suggestion = await fetchPrechatSuggestion(description)
        if (!suggestion) {
          createTicket(answers)
          clearDesc()
        }
        setResultBanner(suggestion)
        setIsLoading(false)
      } catch (err) {
        console.warn(err)
        clearDesc()
        createTicket(answers)
        setIsLoading(false)
      }
    },
    [fetchPrechatSuggestion, sendChatEvent, createTicket, setDesc, clearDesc]
  )

  const onFlowContinue = () => {
    sendChatEvent({
      type: 'dexter rejected',
    })
    setIsLoading(true)
    clearDesc()
    createTicket(formAnswers, resultBanner?.titleKey)
  }

  if (isLoading) {
    return <LoadScreen />
  }

  if (isPreChatBanner && (isUnderReview || banners.length > 0)) {
    return (
      <PreChatBanners
        statusBanners={banners}
        onContinue={() => setIsPreChatBanner(false)}
        onClose={closeChat}
      />
    )
  }

  if (resultBanner) {
    return (
      <DexterResponseBanner
        suggestion={resultBanner}
        onBack={() => {
          setResultBanner(null)
          sendChatEvent({ type: 'dexter back' })
        }}
        onFinish={() => {
          closeChat()
          sendChatEvent({ type: 'dexter accepted' })
        }}
        onContinue={onFlowContinue}
      />
    )
  }

  return (
    <ScrollableWrapper>
      <FormWidget
        api={api}
        onBackButtonClick={closeChat}
        onFlowComplete={onFlowComplete}
        flowId={staticFlowId}
        inputVariant='grey'
      />
    </ScrollableWrapper>
  )
}
