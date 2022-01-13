export const I18N_NAMESPACE = 'pages.RequestScopedToken'

export enum RequestScopedTokenScreen {
  BeforeYouStart = 'BeforeYouStart',
  CameraAccessDeniedScreen = 'CameraAccessDeniedScreen',
  ConfirmSelfie = 'ConfirmSelfie',
  IdentityVerificationFailed = 'IdentityVerificationFailed',
  SelfieDidNotMatch = 'SelfieDidNotMatch',
  SelfieUploadFailedScreen = 'SelfieUploadFailedScreen',
  TakeSelfie = 'TakeSelfie',
}

export const VIDEO_CONSTRAINTS: MediaTrackConstraintSet = {
  facingMode: 'user',
  aspectRatio: 1.7,
}
