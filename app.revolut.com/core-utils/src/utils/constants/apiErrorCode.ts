/**
 * Based on revolut-server/core-types/src/main/java/com/revolut/core/errors/ErrorCodes.java
 */
export enum ApiErrorCode {
  UnsupportedCountry = 1000,
  InsufficientBalance = 1006,
  InvalidPostCode = 1036,

  ExistingPasscodeIncorrect = 1049,

  TopupCardTopupPending = 1017,
  TopupCardUnsupportedIssuer = 1020,
  TopupCardUnsupportedIssuerCountry = 1044,
  TopupCardUnsupportedCardBrand = 1092,
  TopupCardUnsupportedCardType = 1093,
  TopupCardUnsupportedCreditCard = 10931,

  UnsupportedAppVersion = 2000,

  IdentityVerificationFailed = 9001,
  SelfieNotMatch = 9002,

  Unauthorised = 9001,
  SignInAppApprovalRequired = 9035,
  ActionRequiresKyc = 9999,

  OtpIncorrect = 9004,

  VerificationRequired = 9014,

  ShieldClientInvalidState = 11102,
  AccessForbiddenOnCountryBasis = 26000,

  TransferLimitExceeded = 4005,
  BankTransferCurrencyCloudAboveLimit = 4017,
  BankTransferCurrencyCloudBelowLimit = 4026,
}
