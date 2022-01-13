import React, { ComponentProps } from 'react'
import { Box, InputVariant } from '@revolut/ui-kit'
import styled from 'styled-components'

import { Api } from '../api'
import { FlowPage } from '../FlowPage'
import { AllWidgetProviders } from '../providers/AllWidgetProviders'

export const WidgetWrapper = styled(Box)`
  height: 100%;
`

type Props = ComponentProps<typeof FlowPage> & {
  api: Api
  inputVariant?: InputVariant
}

export const FormWidget = ({ api, flowId, inputVariant, ...rest }: Props) => (
  <AllWidgetProviders api={api} inputVariant={inputVariant}>
    <WidgetWrapper>
      <FlowPage flowId={flowId} {...rest} />
    </WidgetWrapper>
  </AllWidgetProviders>
)
