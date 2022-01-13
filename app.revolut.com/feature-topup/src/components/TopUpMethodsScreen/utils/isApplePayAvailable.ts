import { UserFeatureName } from '@revolut/rwa-core-config'
import { UserFeatureDto } from '@revolut/rwa-core-types'
import { browser, isUserFeatureEnabled } from '@revolut/rwa-core-utils'

import { isValidApplePayOrigin } from './isValidApplePayOrigin'

const CAN_MAKE_PAYMENTS =
  window.ApplePaySession && isValidApplePayOrigin() && ApplePaySession.canMakePayments()
const MIN_IOS_VERSION_FOR_CHINA = 11.2

export const isApplePayAvailable = (
  isFromChina: boolean,
  userFeatures: ReadonlyArray<UserFeatureDto>,
) => {
  if (!CAN_MAKE_PAYMENTS) {
    return false
  }

  if (!isUserFeatureEnabled(userFeatures, UserFeatureName.TopUpApplePay)) {
    return false
  }

  // Check ApplePay availability for users from China
  // See https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/checking_for_apple_pay_availability
  if (isFromChina) {
    return (
      browser.isIPhoneOrIPad() && browser.getIOSVersion() >= MIN_IOS_VERSION_FOR_CHINA
    )
  }

  return true
}
