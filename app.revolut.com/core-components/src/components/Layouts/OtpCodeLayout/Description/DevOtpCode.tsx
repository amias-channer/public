import { FC } from 'react'
import { Box, Text } from '@revolut/ui-kit'

type DevOtpCodeProps = {
  code: string
  onClick: (code: string) => void
}

export const DevOtpCode: FC<DevOtpCodeProps> = ({ code, onClick }) => {
  const handleCodeClick = () => {
    onClick(code)
  }

  return (
    <Box mb="16px">
      <Text fontWeight="bold" onClick={handleCodeClick}>
        {code}
      </Text>
    </Box>
  )
}
