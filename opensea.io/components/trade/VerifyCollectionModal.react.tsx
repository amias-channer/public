import React from "react"
import { UncontrolledModalProps } from "../../design-system/Modal"
import MultiStepModal, {
  MultiStepModalProps,
} from "../../design-system/Modal/MultiStepModal.react"
import useAppContext from "../../hooks/useAppContext"
import useOpenIfLoggedIn from "../../hooks/useOpenIfLoggedIn"
import CollectionDetailsModal from "../modals/CollectionDetailsModal.react"

type Props = Pick<MultiStepModalProps, "onClose" | "onPrevious"> & {
  trigger: UncontrolledModalProps["trigger"]
  assetId?: string
  renderNextModal: (onClose: () => unknown) => React.ReactNode
}

const VerifyCollectionModal = ({
  assetId,
  trigger,
  renderNextModal,
  onClose,
  onPrevious,
}: Props) => {
  const { wallet } = useAppContext()
  const viewer = wallet.getActiveAccountKey()
  const handleOpen = useOpenIfLoggedIn()

  if (!assetId) {
    return null
  }

  return (
    <MultiStepModal
      size="large"
      trigger={open => trigger(handleOpen(open))}
      onClose={onClose}
      onPrevious={onPrevious}
    >
      {onClose =>
        viewer && (
          <CollectionDetailsModal
            assetId={assetId}
            renderNextModal={() => renderNextModal(onClose)}
          />
        )
      }
    </MultiStepModal>
  )
}

export default VerifyCollectionModal
