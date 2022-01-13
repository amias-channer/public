import { FC, ReactNode } from 'react'

import { AbsoluteLoader, BackButton } from '@revolut/rwa-core-components'

import { Footer } from 'components/Footer'

import { PageLayoutVariant } from './constants'
import { PageLayoutBase, PageLayoutContent } from './styled'

export type PageLayoutProps = {
  isLoading?: boolean
  variant?: PageLayoutVariant
  onBackButtonClick?: VoidFunction
  withFooter?: boolean
  title?: ReactNode
  noHeader?: boolean
}

export const PageLayout: FC<PageLayoutProps> = ({
  children,
  isLoading,
  variant = PageLayoutVariant.Details,
  onBackButtonClick,
  withFooter = true,
}) => {
  const isDetailsVariant = variant === PageLayoutVariant.Details
  const isFooterShown = variant === PageLayoutVariant.WithSidebar && withFooter

  return (
    <PageLayoutBase variant={variant} flex="1">
      {isLoading ? (
        <AbsoluteLoader />
      ) : (
        <>
          {isDetailsVariant && onBackButtonClick && (
            <BackButton onClick={onBackButtonClick} />
          )}

          <PageLayoutContent variant={variant}>
            {children}
            {isFooterShown && <Footer />}
          </PageLayoutContent>
        </>
      )}
    </PageLayoutBase>
  )
}
