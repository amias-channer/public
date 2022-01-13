import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Link } from '@revolut/rwa-core-components'
import { PricingPlanDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../../constants'
import { useGetAgreementTextResources } from './hooks'

type AgreementTextProps = {
  pricingPlan: PricingPlanDto
}

export const AgreementText: FC<AgreementTextProps> = ({ pricingPlan }) => {
  const { t } = useTranslation([I18_NAMESPACE, I18nNamespace.Common])
  const { agreementI18nKey, interpolationValues, termsUrl } =
    useGetAgreementTextResources(pricingPlan)

  return (
    <Trans
      t={t}
      tOptions={{
        interpolation: {
          escapeValue: false,
        },
      }}
      i18nKey={agreementI18nKey}
      values={{ ...interpolationValues }}
      components={{
        termsLink: <Link href={termsUrl} isNewTab />,
      }}
    />
  )
}
