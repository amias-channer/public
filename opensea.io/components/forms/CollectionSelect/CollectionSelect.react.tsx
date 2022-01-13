import React, { useCallback } from "react"
import {
  AsyncSelect,
  AsyncSelectProps,
} from "../../../design-system/AsyncSelect/AsyncSelect.react"
import { Avatar } from "../../../design-system/Avatar"
import useAppContext from "../../../hooks/useAppContext"
import { useTranslations } from "../../../hooks/useTranslations"
import { CollectionSelectQuery } from "../../../lib/graphql/__generated__/CollectionSelectQuery.graphql"
import { fetch, getNodes, graphql } from "../../../lib/graphql/graphql"

export type CollectionSelectProps = Pick<
  AsyncSelectProps,
  "value" | "onSelect" | "id" | "name"
>

export const CollectionSelect = ({ value, ...rest }: CollectionSelectProps) => {
  const { tr } = useTranslations()
  const { wallet } = useAppContext()

  const search = useCallback(
    async query => {
      const { collections } = await fetch<CollectionSelectQuery>(
        graphql`
          query CollectionSelectQuery(
            $query: String
            $editor: IdentityInputType!
          ) {
            collections(
              editor: $editor
              first: 25
              sortBy: CREATED_DATE
              query: $query
            ) {
              edges {
                node {
                  name
                  imageUrl
                  slug
                }
              }
            }
          }
        `,
        {
          editor: wallet.getActiveAccountKey() ?? {},
          query,
        },
      )

      return getNodes(collections).map(({ name, slug, imageUrl }) => ({
        label: name,
        value: slug,
        avatar: imageUrl ? { src: imageUrl, outline: 0, size: 32 } : undefined,
      }))
    },
    [wallet],
  )

  return (
    <AsyncSelect
      clearable={false}
      loadingConfiguration={{ avatar: true, description: true }}
      placeholder={tr("Select collection")}
      search={search}
      startEnhancer={
        value ? <Avatar {...value.avatar} outline={0} size={24} /> : null
      }
      value={value}
      {...rest}
    />
  )
}

export default CollectionSelect
