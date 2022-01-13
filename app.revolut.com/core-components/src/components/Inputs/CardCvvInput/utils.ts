const CVV_MAX_LENGTH = 3

const sanitizeCvv = (value: string) => value.replace(/[^\d]/g, '')

export const formatCvv = (value: string) => {
  if (!value) {
    return ''
  }

  return sanitizeCvv(value).substr(0, CVV_MAX_LENGTH)
}
