import trimEnd from 'lodash/trimEnd'

const DELIMITER = ' '

export const formatIban = (value: string) =>
  trimEnd(value.replace(/(.{4})/g, `$1${DELIMITER}`), DELIMITER)
