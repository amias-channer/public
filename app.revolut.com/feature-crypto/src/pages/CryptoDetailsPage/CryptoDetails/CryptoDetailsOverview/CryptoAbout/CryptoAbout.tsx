import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Subheader, TextWidget, Text, List, Link } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { CryptoDetailsDto } from '@revolut/rwa-core-types'

import { I18N_NAMESPACE } from '../../../constants'

type Props = {
  cryptoCode: string
  cryptoDetails: CryptoDetailsDto
}

export const CryptoAbout: FC<Props> = ({ cryptoCode, cryptoDetails }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  return (
    <>
      <Subheader>
        <Subheader.Title>{t('CryptoAbout.title', { cryptoCode })}</Subheader.Title>
      </Subheader>
      <TextWidget>
        <TextWidget.Content>
          {cryptoDetails?.description && <Text use="p">{cryptoDetails.description}</Text>}
          <List mt="s-8">
            {cryptoDetails?.website && (
              <List.Item
                useIcon={Icons.Globe}
                use={Link}
                href={cryptoDetails.website}
                target="_blank"
              >
                {t('CryptoAbout.website')}
              </List.Item>
            )}
            {cryptoDetails?.whitepaperLink && (
              <List.Item
                useIcon={Icons.Document}
                use={Link}
                href={cryptoDetails.whitepaperLink}
                target="_blank"
              >
                {t('CryptoAbout.whitepaperLink')}
              </List.Item>
            )}
          </List>
        </TextWidget.Content>
      </TextWidget>
    </>
  )
}
