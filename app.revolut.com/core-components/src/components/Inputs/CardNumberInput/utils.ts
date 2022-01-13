import endsWith from 'lodash/endsWith'
import startsWith from 'lodash/startsWith'

const MAX_CARD_DIGITS = 19

export const sanitizeCardNumber = (value: string) => value.replace(/[^\d]+/gi, '')

export const addSpacesToCardNumberGroups = (value: string) =>
  value.replace(/(\d{4})/g, '$1 ')

const isCardNumberConsistsOfGroupsOnly = (value: string) => value.length % 4 === 0

const cutLastCardNumberDigit = (value: string) => value.slice(0, value.length - 1)

const isLastSpaceWasRemoved = (value: string, prevValue: string) =>
  endsWith(prevValue, ' ') && !endsWith(value, ' ')

const checkAndRemoveLastDigit = (value: string, prevValue: string) => {
  const sanitizedCardNumber = sanitizeCardNumber(value)

  if (
    sanitizedCardNumber &&
    isLastSpaceWasRemoved(value, prevValue) &&
    startsWith(prevValue, value)
  ) {
    if (isCardNumberConsistsOfGroupsOnly(sanitizedCardNumber)) {
      return cutLastCardNumberDigit(sanitizedCardNumber)
    }

    return sanitizedCardNumber
  }

  return sanitizedCardNumber
}

export const normalizeCardNumber = (value: string, prevValue: string = '') => {
  if (!value) {
    return ''
  }

  const modifiedCardNumber = checkAndRemoveLastDigit(value, prevValue)

  return modifiedCardNumber.substr(0, MAX_CARD_DIGITS)
}
