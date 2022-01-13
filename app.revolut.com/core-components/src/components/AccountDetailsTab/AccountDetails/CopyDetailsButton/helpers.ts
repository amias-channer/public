import { Detail } from './types'

export const getContentToCopy = (details: Detail[]) =>
  details
    .reduce<string[]>((acc, { title, value }) => acc.concat(`${title}: ${value}`), [])
    .join('\n')
