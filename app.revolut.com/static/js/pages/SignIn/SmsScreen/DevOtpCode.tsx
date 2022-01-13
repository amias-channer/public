import { FC } from 'react'
import { TextBox } from '@revolut/ui-kit'

type DevOtpCodeProps = {
  code: string
  onClick: (code: string) => void
}

export const DevOtpCode: FC<DevOtpCodeProps> = ({ code, onClick }) => {
  const handleCodeClick = () => {
    onClick(code)
  }

  return (
    <TextBox mt="px16" fontWeight="bold" onClick={handleCodeClick}>
      {code}
    </TextBox>
  )
}
