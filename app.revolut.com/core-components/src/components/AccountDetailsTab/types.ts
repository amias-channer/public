export enum AccountDetailsType {
  Local = 'local',
  Swift = 'swift',
}

export type AccountDetail = {
  title: string
  value: string
  marked?: boolean
  hint?: string
}
