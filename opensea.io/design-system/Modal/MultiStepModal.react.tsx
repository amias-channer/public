import React from "react"
import { isFunction } from "lodash"
import Modal, { ModalProps } from "./Modal.react"
import { MultiStepFlow, MultiStepFlowProps } from "./MultiStepFlow.react"

export type MultiStepModalProps = ModalProps &
  Omit<MultiStepFlowProps, "children">

export const MultiStepModal = ({
  children,
  onPrevious,
  ...rest
}: MultiStepModalProps) => {
  return (
    <Modal {...rest}>
      {close => (
        <MultiStepFlow onPrevious={onPrevious}>
          {isFunction(children) ? children(close) : children}
        </MultiStepFlow>
      )}
    </Modal>
  )
}

export default MultiStepModal
