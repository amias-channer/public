import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Paragraph, TextButton } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { useSignUpTranslation } from '../../hooks'

export const Description: FC = () => {
  const t = useSignUpTranslation()

  return (
    <>
      {t('HomeAddressScreen.description.part1')}
      <Paragraph>{t('HomeAddressScreen.description.part2')}</Paragraph>
      <Paragraph>
        <TextButton use={Link} to={Url.Start}>
          {t('HomeAddressScreen.description.link')}
        </TextButton>
      </Paragraph>
    </>
  )
}
