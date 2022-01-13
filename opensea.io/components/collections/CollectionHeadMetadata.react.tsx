import React from "react"
import { DEFAULT_IMG } from "../../constants"
import { CollectionHeadMetadata_data } from "../../lib/graphql/__generated__/CollectionHeadMetadata_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import Head from "../layout/Head.react"

interface Props {
  data: CollectionHeadMetadata_data | null
}

const CollectionHeadMetadata = ({ data }: Props) => (
  <Head
    description={data?.collection?.description || ""}
    image={
      data?.collection?.bannerImageUrl ||
      data?.collection?.imageUrl ||
      DEFAULT_IMG
    }
    title={`${
      data?.collection?.name ? `${data?.collection.name} Marketplace on ` : ""
    }OpenSea: Buy, sell, and explore digital assets`}
  />
)

export default fragmentize(CollectionHeadMetadata, {
  fragments: {
    data: graphql`
      fragment CollectionHeadMetadata_data on Query
      @argumentDefinitions(collection: { type: "CollectionSlug!" }) {
        collection(collection: $collection) {
          bannerImageUrl
          description
          imageUrl
          name
        }
      }
    `,
  },
})
