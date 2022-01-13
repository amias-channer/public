import { FC } from 'react'
import { Flex, Box } from '@revolut/ui-kit'
import { getFormattedDate } from '@revolut/rwa-core-utils'
import { Time } from '@revolut/rwa-core-components'

type Props = {
  datetime: number
}

export const DateTime: FC<Props> = ({ datetime }) => {
  return (
    <Flex>
      {getFormattedDate(new Date(datetime))}
      <Box ml="px8">
        <Time value={datetime} />
      </Box>
    </Flex>
  )
}
