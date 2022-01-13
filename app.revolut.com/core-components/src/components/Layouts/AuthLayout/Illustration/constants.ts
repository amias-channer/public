import { getIllustrationUrl } from '@revolut/rwa-core-utils'

export enum IllustrationAssetId {
  Camera = 'Camera',
  DownloadTheApp = 'DownloadTheApp',
  GetStarted = 'GetStarted',
  GetStarted_V2 = 'GetStarted_V2',
  KycFailed = 'KycFailed',
  KycNotStartedOrPending = 'KycNotStartedOrPending',
  Passcode = 'Passcode',
  Phone = 'Phone',
  PhonePasscode = 'PhonePasscode',
  PushNotificationCode = 'PushNotificationCode',
  UnsupportedCountry = 'UnsupportedCountry',
  WaitingList = 'WaitingList',
  OtpViaEmail = 'OtpViaEmail',
  OtpViaSms = 'OtpViaSms',
  StoryPayments = 'StoryPayments',
}

export const IllustrationAsset = {
  [IllustrationAssetId.Camera]: getIllustrationUrl('camera'),
  [IllustrationAssetId.DownloadTheApp]: getIllustrationUrl('download-the-app'),
  [IllustrationAssetId.GetStarted]: getIllustrationUrl('get-started'),
  [IllustrationAssetId.GetStarted_V2]: getIllustrationUrl('v2/get-started'),
  [IllustrationAssetId.KycFailed]: getIllustrationUrl('kyc-failed'),
  [IllustrationAssetId.KycNotStartedOrPending]: getIllustrationUrl(
    'kyc-not-started-or-pending',
  ),
  [IllustrationAssetId.Passcode]: getIllustrationUrl('passcode'),
  [IllustrationAssetId.Phone]: getIllustrationUrl('phone'),
  [IllustrationAssetId.PhonePasscode]: getIllustrationUrl('phone-pass-code'),
  [IllustrationAssetId.PushNotificationCode]: getIllustrationUrl(
    'push-notification-code',
  ),
  [IllustrationAssetId.UnsupportedCountry]: getIllustrationUrl('unsupported-country'),
  [IllustrationAssetId.WaitingList]: getIllustrationUrl('waiting-list'),
  [IllustrationAssetId.OtpViaEmail]: getIllustrationUrl('otp-via-email'),
  [IllustrationAssetId.OtpViaSms]: getIllustrationUrl('otp-via-sms'),
  [IllustrationAssetId.StoryPayments]: getIllustrationUrl('story-payments'),
}

export const THEME_ILLUSTRATION_SIZE_KEY = 'components.AuthLayout.Illustration.size'
