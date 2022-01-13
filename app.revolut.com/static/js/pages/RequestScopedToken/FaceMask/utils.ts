const INITIAL_WINDOW_WIDTH = 1440
const INITIAL_WINDOW_HEIGHT = 736
const MASK_INITIAL_WIDTH = 272
const MASK_INITIAL_HEIGHT = 400
const MIN_AVAILABLE_WIDTH_FREE_SPACE = 70 // iPhone X has about 76
const DEFAULT_SCALE_RATIO = 1

const roundToTwoFractionDigits = (num: number) => Math.round(num * 100) / 100

export const getScaleRatio = (windowWidth: number, windowHeight: number): number => {
  const widthRatio = roundToTwoFractionDigits(windowWidth / INITIAL_WINDOW_WIDTH)
  const heightRatio = roundToTwoFractionDigits(windowHeight / INITIAL_WINDOW_HEIGHT)

  if (widthRatio > heightRatio) {
    const isMaskWithWidthRatioMatchesHeight =
      windowHeight - widthRatio * MASK_INITIAL_HEIGHT >=
      INITIAL_WINDOW_HEIGHT - MASK_INITIAL_HEIGHT

    if (isMaskWithWidthRatioMatchesHeight) {
      return widthRatio
    }
  }

  const isMaskWithHeightRatioMatchesWidth =
    windowWidth - heightRatio * MASK_INITIAL_WIDTH >= MIN_AVAILABLE_WIDTH_FREE_SPACE

  if (isMaskWithHeightRatioMatchesWidth) {
    return heightRatio
  }

  return DEFAULT_SCALE_RATIO
}
