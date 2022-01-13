import React, { FC } from 'react'
import { H1, Text, Box } from '@revolut/ui-kit'

import { FlowViewItemType, FlowViewItemImageContent } from '../../appConstants'
import { FlowView, FlowViewItem } from '../../types'
import { Actions as UseFormActions } from '../useFlowPage'

import { ContainerStyled, OuterWrapper } from './styled'
import useControlItem from './useControlItem'

export type Props = {
  isTransition: boolean
  view: FlowView
  changeViewItemValues: UseFormActions['changeViewItemValues']
  setDataFetching: (state: boolean) => void
}

const ControlsView: FC<Props> = ({
  isTransition,
  view,
  changeViewItemValues,
  setDataFetching,
}) => {
  const viewItems = view.lottieIconUrl
    ? [
        ...(view.items || []),
        {
          type: FlowViewItemType.Image,
          url: view.lottieIconUrl,
          content: FlowViewItemImageContent.Lottie,
        } as FlowViewItem,
      ]
    : view.items

  const { imageItems, items } = useControlItem({
    changeViewItemValues,
    isTransition,
    items: viewItems,
    setDataFetching,
  })

  const content = (
    <OuterWrapper>
      <Box mb="s-32">
        {Boolean(imageItems?.length) && (
          <Box mt="s-16" mb="s-16">
            {imageItems}
          </Box>
        )}
        <H1>{view.title}</H1>
        {view.subtitle && (
          <Text display="block" variant="caption" mt="s-8" color="grey-tone-50">
            {view.subtitle}
          </Text>
        )}
      </Box>
      {items}
    </OuterWrapper>
  )

  return <ContainerStyled>{content}</ContainerStyled>
}

export default ControlsView
