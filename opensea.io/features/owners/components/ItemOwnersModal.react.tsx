import React, { Suspense } from "react"
import type { BlockProps } from "../../../design-system/Block"
import Modal from "../../../design-system/Modal"
import { useTranslations } from "../../../hooks/useTranslations"
import type { ItemOwnersListLazyQuery } from "../../../lib/graphql/__generated__/ItemOwnersListLazyQuery.graphql"
import {
  ItemOwnersListSkeleton,
  ItemsOwnersLazyList,
} from "./ItemOwnersList.react"

export type ItemOwnersModalProps = ItemOwnersListLazyQuery["variables"] & {
  numOwners?: number
}

const modalBodyProps: BlockProps = {
  height: "50vh",
  maxHeight: 600,
  padding: 0,
  as: Modal.Body,
}

export const ItemOwnersModal = ({
  numOwners,
  ...rest
}: ItemOwnersModalProps) => {
  const { tr } = useTranslations()

  return (
    <>
      <Modal.Header>
        <Modal.Title>{tr("Owned by")}</Modal.Title>
      </Modal.Header>

      <Suspense
        fallback={
          <ItemOwnersListSkeleton
            count={numOwners}
            overrides={{ Root: { props: modalBodyProps } }}
          />
        }
      >
        <ItemsOwnersLazyList
          {...rest}
          overrides={{ Root: { props: modalBodyProps } }}
        />
      </Suspense>
    </>
  )
}

export default ItemOwnersModal
