export const formatDecimalToPercents = (decimal: number) => {
  const percents = decimal * 100
  const [, fractionalPart] = `${percents}`.split('.')

  if (fractionalPart && fractionalPart.length > 2) {
    const withFixedFractionalPart = `${percents.toFixed(2)}`

    if (withFixedFractionalPart.endsWith('0')) {
      return `${percents.toFixed(1)}%`
    }

    return `${withFixedFractionalPart}%`
  }

  return `${percents}%`
}
