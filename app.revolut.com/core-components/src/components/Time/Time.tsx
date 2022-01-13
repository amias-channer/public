import { format as formatFNS } from 'date-fns'
import { FC } from 'react'

type TimeProps = {
  value?: Date | number
  format?: string
}

export const Time: FC<TimeProps> = ({ value, format = 'HH:mm' }) =>
  value ? <div>{formatFNS(value, format)}</div> : null
