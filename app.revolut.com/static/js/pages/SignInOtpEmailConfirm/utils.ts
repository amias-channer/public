export const parseSecurityCode = (value?: string) =>
  value ? value.replace(/\D/g, '') : ''

export const isValidSecurityCode = (value: string) => /^[\d]{6}$/.test(value)

export const formatSecurityCode = (value: string) =>
  value
    .replace(/(\d{3})(\d{3})/, '$1-$2')
    .split('')
    .join(' ')
