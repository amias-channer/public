import * as React from 'react'
import styled from 'styled-components'
import * as Icons from '@revolut/icons'
import { Box, TextBox } from '@revolut/ui-kit'
import { themeGet } from '@styled-system/theme-get'

export type Props = {
  outlined?: boolean
  icon?: Icons.UiKitIconComponentType
  title: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
  testId?: string
}

const StyledBox = styled(Box)<{ outlined?: boolean }>`
  ${(props) =>
    props.outlined && `border: 1px solid ${themeGet('colors.grey-90')(props)}`};
`

export const EmptyStateCard = ({
  outlined,
  icon: Icon = Icons.Time,
  title,
  subtitle,
  children,
  testId,
}: Props) => (
  <StyledBox
    p={{ md: '6rem 10rem', all: '3rem 1.5rem' }}
    bg="white"
    color="black"
    outlined={outlined}
    radius="sheet"
    width="100%"
    data-testid={testId}
  >
    <Icon size={120} color="primary" />
    <TextBox variant="h2" m="2rem 0 0.5rem 0">
      {title}
    </TextBox>
    {subtitle && (
      <TextBox color="grey-35" mb={1}>
        {subtitle}
      </TextBox>
    )}
    {children}
  </StyledBox>
)
