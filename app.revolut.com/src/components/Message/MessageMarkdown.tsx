import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Text } from '@revolut/ui-kit'

type Props = {
  isPreview?: boolean
  linkColor?: string
  children: React.ReactNode
} & ReactMarkdown.ReactMarkdownProps

export const MessageMarkdown = ({
  isPreview = false,
  linkColor = 'primary',
  children,
  ...rest
}: Props) => {
  if (isPreview) {
    return (
      <ReactMarkdown allowedTypes={['text']} unwrapDisallowed {...rest}>
        {children}
      </ReactMarkdown>
    )
  }

  return (
    <ReactMarkdown
      allowedTypes={['paragraph', 'text', 'link', 'emphasis', 'strong']}
      renderers={{
        paragraph: 'div',
        link: (props) => (
          <Text
            use='a'
            variant='secondary'
            color={linkColor}
            style={{ textDecoration: 'underline' }}
            {...props}
          />
        ),
      }}
      linkTarget='_blank'
      unwrapDisallowed
      {...rest}
    >
      {children}
    </ReactMarkdown>
  )
}
