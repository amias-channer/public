import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Footer, Popup, Text } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'
import {
  PricingPlansBillingPeriod,
  PricingPlanDto,
  PricingPlansBillingItemDto,
  PricingPlansBillingCode,
} from '@revolut/rwa-core-types'
import { checkRequired, I18nNamespace } from '@revolut/rwa-core-utils'

import { getPricingPlanBillingForPeriod } from '../../helpers'
import { I18_NAMESPACE } from '../../constants'
import { AgreementText } from './AgreementText'
import { ButtonPriceText } from './ButtonPriceText'
import { MonthlyBillingDuration } from './MonthlyBillingDuration'
import { YearlySavingsContainer } from './styled'
import { YearlySavingsLabel } from './YearlySavingsLabel'

type PricingPlanBillingDialogProps = {
  pricingPlan: PricingPlanDto
  onSubmit: (
    pricingPlanId: string,
    pricingPlanBillingCode: PricingPlansBillingCode,
  ) => void
} & BaseModalProps

export const PricingPlanBillingDialog: FC<PricingPlanBillingDialogProps> = ({
  isOpen,
  pricingPlan,
  onRequestClose,
  onSubmit,
}) => {
  const { t } = useTranslation([I18_NAMESPACE, I18nNamespace.Common])

  const annualBilling = getPricingPlanBillingForPeriod(
    pricingPlan,
    PricingPlansBillingPeriod.P1y,
  )
  const monthlyBilling = getPricingPlanBillingForPeriod(
    pricingPlan,
    PricingPlansBillingPeriod.P1m,
  )

  const handleBillingSelected = (billing: PricingPlansBillingItemDto) => {
    onSubmit(pricingPlan.id, billing.code)
    onRequestClose()
  }

  const handleAnnualBillingSelected = () => {
    handleBillingSelected(checkRequired(annualBilling, 'annual billing can not be empty'))
  }

  const handleMonthlyBillingSelected = () => {
    handleBillingSelected(
      checkRequired(monthlyBilling, 'monthly billing can not be empty'),
    )
  }

  return (
    <Popup isOpen={isOpen} onExit={onRequestClose} variant="dialog">
      <Popup.Header>
        <Popup.Title>
          {t('OrderDialog.title', {
            planName: t(
              `${I18nNamespace.Common}:plans.${pricingPlan.code.toLowerCase()}.name`,
            ),
          })}
        </Popup.Title>
      </Popup.Header>
      <Text use="p" variant="caption" color="grey-tone-50">
        <AgreementText pricingPlan={pricingPlan} />
      </Text>
      <Popup.Actions>
        {annualBilling && (
          <>
            <Button elevated onClick={handleAnnualBillingSelected}>
              <ButtonPriceText pricingPlan={pricingPlan} billing={annualBilling} />
            </Button>
            {monthlyBilling && (
              <YearlySavingsContainer>
                <YearlySavingsLabel
                  pricingPlan={pricingPlan}
                  monthlyBilling={monthlyBilling}
                  annualBilling={annualBilling}
                />
              </YearlySavingsContainer>
            )}
          </>
        )}
        {monthlyBilling && (
          <>
            <Button variant="secondary" onClick={handleMonthlyBillingSelected}>
              <ButtonPriceText pricingPlan={pricingPlan} billing={monthlyBilling} />
            </Button>
            <Footer>
              <MonthlyBillingDuration
                pricingPlan={pricingPlan}
                monthlyBilling={monthlyBilling}
              />
            </Footer>
          </>
        )}
      </Popup.Actions>
    </Popup>
  )
}
