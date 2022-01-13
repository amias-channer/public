import React, { FC } from 'react'
import { useIntl } from 'react-intl'

import { Loader } from '../../components/Loader'
import { Iframe } from '../../components'
import { HELP_CENTRE_EMBEDDED_DEFAULT_URL } from '../../constants/links'
import { FALLBACK_LOCALE, EN_GB_LOCALE } from '../../constants/i18n'
import { useSendChatEvent } from '../../providers'
import { AnalyticsEvent } from '../../constants/analytics'

import { SmartFaq } from './SmartFaq'
import { HelpCentreContainer, LoaderContainer } from './styles'

export const HelpCentre: FC<{ faqRanks: object }> = ({ faqRanks }) => {
  const sendChatEvent = useSendChatEvent()
  const [isLoaded, setLoadState] = React.useState(false)
  const { locale } = useIntl()
  React.useEffect(() => {
    sendChatEvent({ type: AnalyticsEvent.HELP_CENTRE })
  }, [sendChatEvent])

  // temporary check used for covering issue RGW-513 till it will be resolved
  const localeNotSupportedByHelpCentre =
    !locale || locale === EN_GB_LOCALE || locale === FALLBACK_LOCALE
  const iframeUrl = localeNotSupportedByHelpCentre
    ? HELP_CENTRE_EMBEDDED_DEFAULT_URL
    : `https://www.revolut.com/${locale}/business/help/?embeddedBusiness`

  return (
    <HelpCentreContainer>
      {faqRanks && <SmartFaq faqRanks={faqRanks} />}

      {!isLoaded && faqRanks && (
        <LoaderContainer>
          <Loader key='loader' />
        </LoaderContainer>
      )}
      {!isLoaded && !faqRanks && <Loader key='loader' />}
      <Iframe
        id='help-center'
        key='help-center'
        height={faqRanks ? '3000px' : '100%'}
        title='help-center'
        src={iframeUrl}
        onLoad={() => setLoadState(true)}
        hidden={!isLoaded}
      />
    </HelpCentreContainer>
  )
}

HelpCentre.displayName = 'HelpCentre'
