import { rem as polishedRem } from 'polished'

export const ROOT_FONT_SIZE = 16

export const rem = (size = ROOT_FONT_SIZE) => polishedRem(size, ROOT_FONT_SIZE)
