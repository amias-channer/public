import { graphql } from "relay-runtime"

export const ProfilePageAccountFragment = graphql`
  fragment profilePageQueries_account on AccountType
  @argumentDefinitions(isCurrentUser: { type: "Boolean!" }) {
    user {
      favoriteAssetCount
    }
    privateAssetCount @include(if: $isCurrentUser)
  }
`

export const ProfilePageCollectedFragment = graphql`
  fragment profilePageQueries_collected on Query
  @argumentDefinitions(identity: { type: "IdentityInputType" }) {
    search(identity: $identity, first: 0) {
      totalCount
    }
  }
`

export const ProfilePageCreatedFragment = graphql`
  fragment profilePageQueries_created on Query
  @argumentDefinitions(identity: { type: "IdentityInputType" }) {
    search(creator: $identity, first: 0, resultType: ASSETS) {
      totalCount
    }
  }
`
