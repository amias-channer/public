/* eslint-disable coherence/no-confusing-enum */
export enum FieldType {
  TextInput = 'TEXT_INPUT',
  PhoneInput = 'PHONE_INPUT',
  DateInput = 'DATE_INPUT',
  MoneyInput = 'MONEY_INPUT',
  Image = 'IMAGE',
  FilesUpload = 'FILES_UPLOAD',
}

export type TextField = {
  type: FieldType.TextInput
  value: { value?: string }
}

export type DateField = {
  type: FieldType.DateInput
  value: { value?: string }
}

export type FileField = {
  type: FieldType.FilesUpload
  value: {
    files: Array<{
      id: string
      name: string
      source: File
    }>
  }
}

export type PhoneField = {
  type: FieldType.PhoneInput
  value: {
    code: number
    number?: string
  }
}

export type MoneyField = {
  type: FieldType.MoneyInput
  value: {
    currency: string
    amount?: number
  }
}
