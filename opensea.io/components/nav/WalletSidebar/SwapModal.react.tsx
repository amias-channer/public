import React, { Suspense } from "react"
import { UncontrolledModalProps } from "../../../design-system/Modal"
import MultiStepModal from "../../../design-system/Modal/MultiStepModal.react"
import ModalLoader from "../../common/ModalLoader.react"
import { SwapModalContent } from "./SwapModalContent.react"
import { SwapIdentifier } from "./types"

export type SwapModalProps = Pick<UncontrolledModalProps, "trigger"> & {
  from: SwapIdentifier
  to: SwapIdentifier
  onSuccess: () => unknown
}

export const SwapModal = ({ trigger, from, to, onSuccess }: SwapModalProps) => {
  return (
    <MultiStepModal trigger={trigger}>
      {onClose => (
        <Suspense fallback={<ModalLoader />}>
          <SwapModalContent
            from={from}
            to={to}
            onSuccess={onSuccess}
            onViewWallet={onClose}
          />
        </Suspense>
      )}
    </MultiStepModal>
  )
}

export default SwapModal
