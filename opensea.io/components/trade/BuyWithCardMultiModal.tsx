import React from "react"
import { UncontrolledModalProps } from "../../design-system/Modal"
import MultiStepModal, {
  MultiStepModalProps,
} from "../../design-system/Modal/MultiStepModal.react"
import useAppContext from "../../hooks/useAppContext"
import useOpenIfLoggedIn from "../../hooks/useOpenIfLoggedIn"
import { CheckoutModalQueryVariables } from "../../lib/graphql/__generated__/CheckoutModalQuery.graphql"
import MoonPayModal, { MoonPayModalProps } from "./MoonPayModal"

type Props = Pick<MultiStepModalProps, "onClose" | "onPrevious"> & {
  trigger: UncontrolledModalProps["trigger"]
  isDisabled?: boolean
  checkoutVariables: CheckoutModalQueryVariables
} & MoonPayModalProps

export const BuyWithCardMultiModal = ({
  trigger,
  isDisabled,
  onClose,
  onPrevious,
  ...moonPayModalProps
}: Props) => {
  const { wallet } = useAppContext()
  const viewer = wallet.getActiveAccountKey()
  const handleOpen = useOpenIfLoggedIn()

  return (
    <MultiStepModal
      disabled={isDisabled}
      size="large"
      trigger={open => trigger(handleOpen(open))}
      onClose={onClose}
      onPrevious={onPrevious}
    >
      {onClose =>
        viewer && <MoonPayModal onClose={onClose} {...moonPayModalProps} />
      }
    </MultiStepModal>
  )
}

export default BuyWithCardMultiModal
