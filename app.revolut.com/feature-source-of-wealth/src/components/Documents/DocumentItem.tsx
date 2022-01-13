import { FC } from 'react'
import { Document, Delete } from '@revolut/icons'
import { Item, Button, Avatar } from '@revolut/ui-kit'

import { formatBytesSize } from '@revolut/rwa-core-utils'

type DocumentItemProps = {
  onDelete?: (fileName: string) => void
  size: number
  image?: string
  fileName: string
}

export const DocumentItem: FC<DocumentItemProps> = ({
  onDelete,
  size,
  image,
  fileName,
  children,
}) => {
  const handleDelete = () => {
    onDelete?.(fileName)
  }

  return (
    <Item>
      <Item.Avatar>
        <Avatar image={image} useIcon={Document} color="deep-grey" />
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{children}</Item.Title>
        <Item.Description color="warning">{formatBytesSize(size)}</Item.Description>
      </Item.Content>
      <Item.Side>
        <Button variant="text" size="sm" useIcon={Delete} onClick={handleDelete} />
      </Item.Side>
    </Item>
  )
}
