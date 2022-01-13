const DEFAULT_FRACTION = 2

type FormatOptions = Intl.NumberFormatOptions & {
  fraction?: number
}

export const formatPercents = (
  value: number,
  {
    fraction,
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay,
  }: FormatOptions = {},
) =>
  value.toLocaleString('en-GB', {
    style: 'percent',
    minimumFractionDigits: minimumFractionDigits ?? fraction ?? DEFAULT_FRACTION,
    maximumFractionDigits: maximumFractionDigits ?? fraction ?? DEFAULT_FRACTION,
    signDisplay,
  })
