const DEFAULT_SYMBOLS: string[] = ["ETH", "WETH", "DAI", "USDC"]

export const sortBySymbol = <T>(xs: T[], getSymbol: (x: T) => string): T[] => {
  return [...xs].sort((a, b) => {
    const aIndex = DEFAULT_SYMBOLS.indexOf(getSymbol(a))
    const bIndex = DEFAULT_SYMBOLS.indexOf(getSymbol(b))
    if (aIndex < 0 && bIndex < 0) {
      return getSymbol(a).localeCompare(getSymbol(b))
    } else if (aIndex < 0) {
      return 1
    } else if (bIndex < 0) {
      return -1
    }

    return aIndex - bIndex
  })
}
