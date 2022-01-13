import { UserAuthFlowElement } from '@revolut/rwa-core-types'

import { BirthDateScreen } from './BirthDateScreen'
import { DisclosureScreen } from './DisclosureScreen'
import { EmailScreen } from './EmailScreen'
import { SignUpScreen } from './enums'
import { HomeAddressScreen } from './HomeAddressScreen'
import { NameScreen } from './NameScreen'
import { OccupationScreen } from './OccupationScreen'
import { PasscodeScreen } from './PasscodeScreen'
import { PurposeScreen } from './PurposeScreen'
import { SuccessScreen } from './SuccessScreen'
import { SignUpScreenComponent } from './types'
import { USCodeScreen } from './USCodeScreen'
import { WaitingListScreen } from './WaitingListScreen'

export const SCREENS: { [T in SignUpScreen]: SignUpScreenComponent } = {
  [SignUpScreen.Passcode]: PasscodeScreen,
  [SignUpScreen.HomeAddress]: HomeAddressScreen,
  [SignUpScreen.Name]: NameScreen,
  [SignUpScreen.BirthDate]: BirthDateScreen,
  [SignUpScreen.Email]: EmailScreen,
  [SignUpScreen.Disclosure]: DisclosureScreen,
  [SignUpScreen.USCode]: USCodeScreen,
  [SignUpScreen.Occupation]: OccupationScreen,
  [SignUpScreen.Purpose]: PurposeScreen,
  [SignUpScreen.Success]: SuccessScreen,
  [SignUpScreen.WaitingList]: WaitingListScreen,
}

export const ALIASES = {
  [UserAuthFlowElement.Password]: SignUpScreen.Passcode,
  [UserAuthFlowElement.Country]: SignUpScreen.HomeAddress,
  [UserAuthFlowElement.Address]: SignUpScreen.HomeAddress,
  [UserAuthFlowElement.Name]: SignUpScreen.Name,
  [UserAuthFlowElement.BirthDate]: SignUpScreen.BirthDate,
  [UserAuthFlowElement.Email]: SignUpScreen.Email,
  [UserAuthFlowElement.Disclosure]: SignUpScreen.Disclosure,
  [UserAuthFlowElement.SsnItin]: SignUpScreen.USCode,
  [UserAuthFlowElement.Occupation]: SignUpScreen.Occupation,
  [UserAuthFlowElement.AccountPurpose]: SignUpScreen.Purpose,
  [UserAuthFlowElement.WaitingList]: SignUpScreen.WaitingList,
  [UserAuthFlowElement.WaitingListWithPanEntry]: SignUpScreen.WaitingList,
}
