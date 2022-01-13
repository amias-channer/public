import { FC } from 'react'
import { TextButton } from '@revolut/ui-kit'

import { browser, Url } from '@revolut/rwa-core-utils'

const getVerifyLinkHref = (token: string) =>
  browser.getUrlWithOrigin(`${Url.SignInOtpEmailConfirm}?token=${token}`)

type DevOtpCodeProps = {
  code: string
}

export const DevOtpCode: FC<DevOtpCodeProps> = ({ code }) => {
  const verifyLinkHref = getVerifyLinkHref(code)

  return (
    <TextButton use="a" href={verifyLinkHref} target="_blank" variant="primary" mt="px16">
      {verifyLinkHref}
    </TextButton>
  )
}
