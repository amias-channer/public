import isEmpty from 'lodash/isEmpty'
import { FC, ReactNode } from 'react'
import { InfoOutline } from '@revolut/icons'
import { Header as UiKitHeader, chain, IconButton } from '@revolut/ui-kit'

type HeaderProps = {
  onBack?: VoidFunction
  onInfo?: VoidFunction
  breadcrumbs?: ReactNode[]
  description?: ReactNode
}

export const Header: FC<HeaderProps> = ({
  onBack,
  onInfo,
  breadcrumbs = [],
  description,
  children,
}) => {
  return (
    <UiKitHeader variant="item">
      {onBack && <UiKitHeader.BackButton onClick={onBack} />}

      {onInfo && (
        <UiKitHeader.Actions>
          <IconButton onClick={onInfo} useIcon={InfoOutline} color="black" />
        </UiKitHeader.Actions>
      )}

      <UiKitHeader.Title>{children}</UiKitHeader.Title>

      {breadcrumbs && !isEmpty(breadcrumbs) && (
        <UiKitHeader.Subtitle>{chain(breadcrumbs)}</UiKitHeader.Subtitle>
      )}
      {description && <UiKitHeader.Description>{description}</UiKitHeader.Description>}
    </UiKitHeader>
  )
}
