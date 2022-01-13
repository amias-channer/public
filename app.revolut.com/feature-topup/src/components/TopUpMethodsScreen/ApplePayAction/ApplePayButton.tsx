import {
  ApplePayButtonIcon,
  PrimaryButton,
  PrimaryButtonProps,
} from '@revolut/rwa-core-components'

export const ApplePayButton = (props: PrimaryButtonProps) => (
  <PrimaryButton {...props} variant="black" bg="black">
    <ApplePayButtonIcon />
  </PrimaryButton>
)
