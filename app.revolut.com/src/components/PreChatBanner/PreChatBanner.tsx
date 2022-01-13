import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box, H3, TextBox, Absolute, Flex } from '@revolut/ui-kit'
import styled from 'styled-components'

import { StatusBannerType } from '../../api/types'
import { ActionButton } from '../ActionButton'
import { useSettings } from '../../providers'

const Sticky = styled(Absolute)`
  position: sticky;
`

const replaceMarkdownLinksWithHtml = (content: string) =>
  content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

const DeepLinkToBusinessLink = {
  'revolut-business://app/help-centre': '/help-centre',
}

const replaceMarkdownDeepLinks = (content: string) => {
  let contentWithBusinessLinks = content

  for (const [deepLink, businessLink] of Object.entries(
    DeepLinkToBusinessLink
  )) {
    contentWithBusinessLinks = content.replace(
      new RegExp(deepLink, 'g'),
      businessLink
    )
  }

  return replaceMarkdownLinksWithHtml(contentWithBusinessLinks)
}

type Props = {
  banner: StatusBannerType
  onContinue: () => void
  onClose: () => void
}

export const PreChatBanner = ({ banner, onContinue, onClose }: Props) => {
  const { transformContent } = useSettings()
  const transformedContent = transformContent(banner.content, 'banner')

  return (
    <>
      <Flex flexDirection='column' alignItems='center'>
        {banner.image && (
          <Box mt='3rem' px='2.5rem'>
            <img src={banner.image} alt='' width='100%' />
          </Box>
        )}
        <H3 pt='1.5rem' px='1.5rem' textAlign='center'>
          {banner.title}
        </H3>
        <TextBox
          color='grey-35'
          textAlign='center'
          px='1.5rem'
          pt='1.5rem'
          dangerouslySetInnerHTML={{
            __html: replaceMarkdownDeepLinks(transformedContent || ''),
          }}
        />
      </Flex>
      <ActionButton mt={2} mb={2} variant='secondary' onClick={onContinue}>
        {banner?.secondaryAction?.title || (
          <FormattedMessage
            id='helpcentre.tickets.chatWithUs'
            defaultMessage='Chat with us'
          />
        )}
      </ActionButton>
      <Sticky bottom={0} pb='1.5rem' zIndex={2} width='100%'>
        <ActionButton variant='primary' onClick={onClose} py={2}>
          {banner?.mainAction?.title || (
            <FormattedMessage
              id='supportChat.ticket.gotcha'
              defaultMessage='Got it!'
            />
          )}
        </ActionButton>
      </Sticky>
    </>
  )
}
