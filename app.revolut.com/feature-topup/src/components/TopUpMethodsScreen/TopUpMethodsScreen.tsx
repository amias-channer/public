import isNil from 'lodash/isNil'
import { FC, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Group, Layout } from '@revolut/ui-kit'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { useAuthContext } from '@revolut/rwa-core-auth'
import {
  useGetUserFeatures,
  useQueryUserConfig,
  useQueryWallet,
} from '@revolut/rwa-core-api'
import { FullPageLoader } from '@revolut/rwa-core-components'
import { AllOrNothing, CurrencyProperties, TopupAmount } from '@revolut/rwa-core-types'
import { checkRequired, COUNTRIES } from '@revolut/rwa-core-utils'

import { CheckoutAmountBreakdown, CheckoutItemProps, CheckoutOverview } from '../Checkout'
import { I18N_NAMESPACE, MIN_PAID_VALUE, TopUpMethod } from '../constants'
import { useGetCurrentPocket } from '../hooks'
import { TopUpContext } from '../TopUpProvider'
import { AmountInput } from './AmountInput'
import { ApplePayAction } from './ApplePayAction'
import { GooglePayAction } from './GooglePayAction'
import { useQueryUserCompany, useQueryUserTopupCards } from './hooks'
import { MethodSelect } from './MethodSelect'
import { ScreenHeader } from './ScreenHeader'
import {
  getAvailableTopUpMethodsForCurrency,
  isApplePayAvailable,
  isGooglePayAvailable,
} from './utils'

type TopUpMethodsScreenProps = {
  title?: string
  submitButtonText?: string
  shouldChangeMethod: (method: TopUpMethod) => boolean
  // Used for top up methods when additional information is required (e.g., card details)
  onShowTopUpMethodScreen: (method: TopUpMethod) => void
  // Otherwise (e.g., Apple Pay)
  onTopUpSuccess: VoidFunction
  onGoBack?: VoidFunction
} & AllOrNothing<{
  checkoutAmount: TopupAmount
  checkoutItems: CheckoutItemProps[]
}>

export const TopUpMethodsScreen: FC<TopUpMethodsScreenProps> = ({
  title,
  submitButtonText,
  checkoutAmount,
  checkoutItems,
  shouldChangeMethod,
  onShowTopUpMethodScreen,
  onTopUpSuccess,
  onGoBack,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { user } = useAuthContext()
  const {
    method,
    checkoutExtraAmount,
    isAmountValid,
    setAmount,
    setCheckoutExtraAmount,
    setAmountValid,
    setMethod,
    allowTopUpGooglePay = false,
  } = useContext(TopUpContext)

  const [userConfig] = useQueryUserConfig()
  const { userFeatures } = useGetUserFeatures()
  const { data: walletData } = useQueryWallet()
  const { data: userCompanyData } = useQueryUserCompany()
  const { data: userTopupCardsData } = useQueryUserTopupCards()
  const currentPocket = useGetCurrentPocket(checkoutAmount?.currency)

  const handleShowTopUpScreen = () => {
    onShowTopUpMethodScreen(checkRequired(method, '"method" can not be empty'))
  }

  useEffect(() => {
    if (!checkoutAmount || !currentPocket) {
      return
    }

    const amountToPay = checkoutAmount.amount - currentPocket.balance

    if (!checkoutExtraAmount) {
      setCheckoutExtraAmount({
        amount: amountToPay < MIN_PAID_VALUE ? MIN_PAID_VALUE : 0,
        currency: checkoutAmount.currency,
      })

      return
    }

    setAmount({
      amount: amountToPay + checkoutExtraAmount.amount,
      currency: checkoutAmount.currency,
    })

    setAmountValid(true)
  }, [
    checkoutAmount,
    checkoutExtraAmount,
    setAmount,
    setCheckoutExtraAmount,
    setAmountValid,
    currentPocket,
  ])

  const renderSubmitAction = () => {
    switch (method) {
      case TopUpMethod.ApplePay:
        return <ApplePayAction disabled={!isAmountValid} onSuccess={onTopUpSuccess} />
      case TopUpMethod.GooglePay:
        return <GooglePayAction disabled={!isAmountValid} onSuccess={onTopUpSuccess} />
      default:
        return (
          <Button disabled={!isAmountValid} onClick={handleShowTopUpScreen}>
            {submitButtonText ?? t('facelift.TopUpMethodsScreen.addMoneyButtonText')}
          </Button>
        )
    }
  }

  useEffect(() => {
    trackEvent(TopUpTrackingEvent.topUpStarted, {
      isCheckout: Boolean(checkoutAmount),
    })
  }, [checkoutAmount])

  if (
    isNil(user) ||
    isNil(userConfig) ||
    isNil(userFeatures) ||
    isNil(walletData) ||
    isNil(userCompanyData) ||
    isNil(userTopupCardsData)
  ) {
    return <FullPageLoader />
  }

  const handleShouldChangeCurrency = (currency: CurrencyProperties) => {
    const { defaultMethod, availableMethods } = getAvailableTopUpMethodsForCurrency(
      currency.code,
      userConfig,
    )

    if (!method || availableMethods.includes(method)) {
      return true
    }

    if (shouldChangeMethod(defaultMethod)) {
      setMethod(defaultMethod)
    }

    return false
  }

  const isFromChina = user.address.country === COUNTRIES.CN.id

  return (
    <Layout>
      <Layout.Main>
        <ScreenHeader title={title} onGoBack={onGoBack} />

        {checkoutAmount && checkoutItems ? (
          <CheckoutOverview
            currency={checkoutAmount.currency}
            checkoutItems={checkoutItems}
          />
        ) : (
          <AmountInput
            minAmountConfig={userConfig.topupMinAmount}
            pockets={walletData.pockets}
            onValidate={setAmountValid}
            shouldChangeCurrency={handleShouldChangeCurrency}
          />
        )}

        <Box mt="16px">
          <Group>
            {checkoutAmount && checkoutExtraAmount && currentPocket && (
              <CheckoutAmountBreakdown
                currentPocket={currentPocket}
                requiredAmount={checkoutAmount}
                extraAmount={checkoutExtraAmount}
              />
            )}

            <MethodSelect
              showApplePay={isApplePayAvailable(isFromChina, userFeatures)}
              showGooglePay={allowTopUpGooglePay && isGooglePayAvailable(userFeatures)}
              linkedCards={userTopupCardsData}
              shouldChangeMethod={shouldChangeMethod}
            />
          </Group>
        </Box>

        <Layout.Actions>{renderSubmitAction()}</Layout.Actions>
      </Layout.Main>
    </Layout>
  )
}
