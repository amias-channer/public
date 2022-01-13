import styled from 'styled-components'
import { Absolute, Tile } from '@revolut/ui-kit'

export const TileTitle = styled(Tile.Title)`
  position: relative;
`

export const TileAssetOverlay = styled(Absolute)`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
`
