import { FC } from 'react'
import { Link } from 'react-router-dom'
import { IconComponentType } from '@revolut/icons'
import { NewProductTile } from '@revolut/ui-kit'

type CardSelectionTileProps = {
  Icon: IconComponentType
  href: string
  title: string
  text: string
  assetUrl: string
}

export const CardTypeSelectionTile: FC<CardSelectionTileProps> = ({
  Icon,
  href,
  title,
  text,
  assetUrl,
}) => (
  <Link to={href}>
    <NewProductTile>
      <NewProductTile.Avatar>
        <Icon color="primary" />
      </NewProductTile.Avatar>
      <NewProductTile.Title>{title}</NewProductTile.Title>
      <NewProductTile.Description>{text}</NewProductTile.Description>
      <NewProductTile.Image src={assetUrl} />
    </NewProductTile>
  </Link>
)
