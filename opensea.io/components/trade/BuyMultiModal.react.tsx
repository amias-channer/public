import React from "react"
import { ChainIdentifier } from "../../constants"
import { UncontrolledModalProps } from "../../design-system/Modal"
import MultiStepModal, {
  MultiStepModalProps,
} from "../../design-system/Modal/MultiStepModal.react"
import useAppContext from "../../hooks/useAppContext"
import useOpenIfLoggedIn from "../../hooks/useOpenIfLoggedIn"
import CheckoutModal from "./CheckoutModal.react"

type Props = Pick<MultiStepModalProps, "onClose" | "onPrevious"> & {
  trigger: UncontrolledModalProps["trigger"]
  assetId: string
  orderId: string
  isDisabled?: boolean
  orderChain?: ChainIdentifier
}

export const BuyMultiModal = ({
  assetId,
  orderId,
  trigger,
  isDisabled,
  orderChain,
  onClose,
  onPrevious,
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
        viewer && (
          <CheckoutModal
            variables={{
              orderId: orderId,
              asset: assetId,
              identity: { address: viewer.address, chain: orderChain },
            }}
            onClose={onClose}
          />
        )
      }
    </MultiStepModal>
  )
}

export default BuyMultiModal
