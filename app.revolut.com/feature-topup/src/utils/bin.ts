import cardValidator from 'card-validator'

const BIN_LENGTH = 6

export const getBin = (value: string) =>
  value.length >= BIN_LENGTH ? value.substr(0, BIN_LENGTH) : undefined

export const validateBin = (value: string) =>
  Boolean(cardValidator.number(value).card?.type)
