import { FilterValue } from '@revolut/rwa-feature-transactions'

const SEPARATOR = '/'

export const toISOInterval = ({ from, to }: FilterValue) => {
  if (!from || !to) {
    return ''
  }

  return [from, to].map((val) => new Date(val).toISOString()).join(SEPARATOR)
}

export const fromISOInterval = (value: string) => {
  if (!value) {
    return { from: '', to: '' }
  }

  const [from, to] = value.split(SEPARATOR)

  return { from, to }
}
