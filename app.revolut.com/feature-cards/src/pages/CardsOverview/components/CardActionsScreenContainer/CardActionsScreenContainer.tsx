import { FC } from 'react'
import { Header, Layout, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { CardItemDto } from '@revolut/rwa-core-types'

import { CardItemSkeleton } from '../CardItemSkeleton'
import { CardItem } from './CardItem'

type CardActionsScreenContainerProps = {
  title: string
  cardData?: CardItemDto
  onClose: VoidFunction
}

export const CardActionsScreenContainer: FC<CardActionsScreenContainerProps> = ({
  children,
  title,
  cardData,
  onClose,
}) => {
  return (
    <ThemeProvider theme={UnifiedTheme}>
      <Layout>
        <Layout.Main>
          <Header variant="form">
            <Header.BackButton aria-label="Back" onClick={onClose} />
            <Header.Title>{title}</Header.Title>
          </Header>
          {cardData ? <CardItem cardData={cardData} /> : <CardItemSkeleton />}
          {children}
        </Layout.Main>
      </Layout>
    </ThemeProvider>
  )
}
