import React, { FC, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Box } from '@revolut/ui-kit'
import { FormWidget } from 'revolut-forms'
import { history } from '../../redux/stores/history'
import {
  getAccessRecoveryFormRaw,
  useAccessRecoveryFormFieldTitle,
} from '../../constants/accessRecovery'
import { TabsEnum } from '../../constants/routerPaths'

import { LoadScreen } from '../../components'
import {
  AccessRecoveryInitialBanner,
  AccessRecoveryForbidden,
} from '../../components/AccessRecovery'
import { useHideChatHeader } from '../../providers'
import { useForm } from './hooks'
import { isCodesEnv } from '../../helpers/hostname'

const ScrollableWrapper = styled(Box)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 16px 16px 0;
`

export const AccessRecovery: FC = () => {
  useHideChatHeader()
  const { formatMessage } = useIntl()

  const { getAccessRecoveryFormFieldTitle } = useAccessRecoveryFormFieldTitle()
  const staticFlowId = useMemo(() => uuid(), [])

  const cancelHandler = () => {
    history.push(TabsEnum.HELP)
  }

  const [
    accessRecoveryInitialBanner,
    setAccessRecoveryInitialBanner,
  ] = useState(true)

  const accessRecoveryFormRaw = getAccessRecoveryFormRaw(
    getAccessRecoveryFormFieldTitle,
    formatMessage
  )

  const { onFlowComplete, isLoading, api } = useForm(
    staticFlowId,
    accessRecoveryFormRaw
  )

  if (isLoading) {
    return <LoadScreen />
  }

  if (accessRecoveryInitialBanner) {
    if (isCodesEnv()) {
      return <AccessRecoveryForbidden onBack={cancelHandler} />
    }

    return (
      <AccessRecoveryInitialBanner
        onContinue={() => {
          setAccessRecoveryInitialBanner(false)
        }}
        onBack={cancelHandler}
      />
    )
  }

  return (
    <ScrollableWrapper>
      <FormWidget
        api={api}
        onBackButtonClick={() => {
          setAccessRecoveryInitialBanner(true)
        }}
        onFlowComplete={onFlowComplete}
        flowId={staticFlowId}
        inputVariant='grey'
      />
    </ScrollableWrapper>
  )
}
