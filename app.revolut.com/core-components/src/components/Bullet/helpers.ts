import { BulletPlacement } from './types'

const BULLET_POSITION_OFFSET_VERTICAL = '2px'
const BULLET_POSITION_OFFSET_HORIZONTAL = '-6px'

export const getPlacementProps = (placement: BulletPlacement) => {
  switch (placement) {
    case 'top-left':
      return {
        top: BULLET_POSITION_OFFSET_VERTICAL,
        left: BULLET_POSITION_OFFSET_HORIZONTAL,
      }
    case 'top-right':
      return {
        top: BULLET_POSITION_OFFSET_VERTICAL,
        right: BULLET_POSITION_OFFSET_HORIZONTAL,
      }
    case 'bottom-left':
      return {
        bottom: BULLET_POSITION_OFFSET_VERTICAL,
        left: BULLET_POSITION_OFFSET_HORIZONTAL,
      }
    case 'bottom-right':
    default:
      return {
        bottom: BULLET_POSITION_OFFSET_VERTICAL,
        right: BULLET_POSITION_OFFSET_HORIZONTAL,
      }
  }
}
