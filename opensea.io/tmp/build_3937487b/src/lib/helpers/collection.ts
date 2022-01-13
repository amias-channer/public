import { _FragmentRefs } from "relay-runtime"
import { collection_url } from "../graphql/__generated__/collection_url.graphql"
import { graphql } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"

const readCollectionUrlIdentifier = inlineFragmentize<collection_url>(
  graphql`
    fragment collection_url on CollectionType @inline {
      slug
    }
  `,
  identifiers => identifiers,
)

export const getCollectionUrl = (
  ref: collection_url | _FragmentRefs<"collection_url">,
) => {
  const { slug } = readCollectionUrlIdentifier(ref)
  return `/collection/${slug}`
}

export const getCollectionEditUrl = (
  ref: collection_url | _FragmentRefs<"collection_url">,
) => {
  const { slug } = readCollectionUrlIdentifier(ref)
  return `/collection/${slug}/edit`
}

export const getCollectionAssetCreateUrl = (
  ref: collection_url | _FragmentRefs<"collection_url">,
) => {
  const { slug } = readCollectionUrlIdentifier(ref)
  return `/collection/${slug}/assets/create`
}

export const getCollectionRoyaltiesUrl = (
  ref: collection_url | _FragmentRefs<"collection_url">,
) => {
  const { slug } = readCollectionUrlIdentifier(ref)
  return `/collection/${slug}/payouts`
}
