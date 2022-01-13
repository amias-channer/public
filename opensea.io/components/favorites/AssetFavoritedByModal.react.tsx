import React, { Suspense } from "react"
import { BlockProps } from "../../design-system/Block"
import Modal from "../../design-system/Modal"
import { useTranslations } from "../../hooks/useTranslations"
import { AssetFavoritedByListLazyQuery } from "../../lib/graphql/__generated__/AssetFavoritedByListLazyQuery.graphql"
import {
  AssetFavoritedByLazyList,
  AssetFavoritedByListSkeleton,
} from "./AssetFavoritedByList.react"

type Props = AssetFavoritedByListLazyQuery["variables"] & {
  numFavorites?: number
}

const modalBodyProps: BlockProps = {
  height: "50vh",
  maxHeight: 600,
  padding: 0,
  as: Modal.Body,
}

export const AssetFavoritedByModal = ({ numFavorites, ...rest }: Props) => {
  const { tr } = useTranslations()
  return (
    <>
      <Modal.Header>
        <Modal.Title>{tr("Favorited by")}</Modal.Title>
      </Modal.Header>

      <Suspense
        fallback={
          <AssetFavoritedByListSkeleton
            numFavorites={numFavorites}
            overrides={{ Root: { props: modalBodyProps } }}
          />
        }
      >
        <AssetFavoritedByLazyList
          {...rest}
          overrides={{ Root: { props: modalBodyProps } }}
        />
      </Suspense>
    </>
  )
}

export default AssetFavoritedByModal
