import trimEnd from 'lodash/trimEnd'

const DELIMITER = '-'

export const formatSortCode = (value: string) =>
  trimEnd(value.replace(/(\d{2})/g, `$1${DELIMITER}`), DELIMITER)
