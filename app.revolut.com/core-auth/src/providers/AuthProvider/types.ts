import {
  PhoneNumberValue,
  User,
  UserAuthFlowElement,
  UserAuthFlowPasswordOperation,
} from '@revolut/rwa-core-types'

export enum SignInFlowChannel {
  PushNotification = 'PUSH_NOTIFICATION',
  Sms = 'SMS',
  Email = 'EMAIL',
  EmailLink = 'EMAIL_LINK',
}

export type AuthContextFlowItem = {
  element: UserAuthFlowElement
  passwordOperation?: UserAuthFlowPasswordOperation
}

export type AuthContextType = {
  signInFlowChannel?: SignInFlowChannel
  setSignInFlowChannel: (flowChannel?: SignInFlowChannel) => void

  beforeStepUpUrl?: string
  setBeforeStepUpUrl: (url?: string) => void

  afterStepUpUrl?: string
  setAfterStepUpUrl: (url?: string) => void

  countryCode?: string
  setCountryCode: (countryCode: string) => void

  flowItem?: AuthContextFlowItem
  setFlowItem: (value: AuthContextFlowItem) => void

  phoneNumber: PhoneNumberValue
  setPhoneNumber: (value: PhoneNumberValue) => void

  securityCode: string
  setSecurityCode: (value: string) => void

  passcode: string
  setPasscode: (value: string) => void

  pushTokenId: string
  setPushTokenId: (value: string) => void

  isAuthorized: boolean
  setAuthorized: (value: boolean) => void

  user?: User
  refetchUser: () => Promise<unknown>
}

export type AuthContextInitialValue = Partial<
  Pick<
    AuthContextType,
    | 'signInFlowChannel'
    | 'beforeStepUpUrl'
    | 'afterStepUpUrl'
    | 'countryCode'
    | 'flowItem'
    | 'phoneNumber'
    | 'securityCode'
    | 'passcode'
    | 'pushTokenId'
  >
>
