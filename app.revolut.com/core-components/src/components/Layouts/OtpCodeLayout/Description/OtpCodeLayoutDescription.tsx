import { FC } from 'react'

import { DevOtpCode } from './DevOtpCode'

type ScreenDescriptionProps = {
  code?: string
  onOtpCodeClick: (otpCode: string) => void
}

export const OtpCodeLayoutDescription: FC<ScreenDescriptionProps> = ({
  code,
  onOtpCodeClick,
}) => {
  return <>{code && <DevOtpCode code={code} onClick={onOtpCodeClick} />}</>
}
