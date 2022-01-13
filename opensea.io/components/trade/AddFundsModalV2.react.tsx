import React from "react"
import { UncontrolledModalProps } from "../../design-system/Modal"
import MultiStepModal from "../../design-system/Modal/MultiStepModal.react"
import { AddFundsModalQueryVariables } from "../../lib/graphql/__generated__/AddFundsModalQuery.graphql"
import { MapNonNullable } from "../../lib/helpers/type"
import AddFundsModal from "./AddFundsModal.react"

type Props = Pick<UncontrolledModalProps, "trigger"> & {
  variables: MapNonNullable<AddFundsModalQueryVariables>
}

export const AddFundsModalV2 = ({ trigger, ...addFundsModalProps }: Props) => {
  return (
    <MultiStepModal trigger={trigger}>
      {onClose => <AddFundsModal {...addFundsModalProps} onClose={onClose} />}
    </MultiStepModal>
  )
}

export default AddFundsModalV2
