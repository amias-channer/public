import { _FragmentRefs } from "relay-runtime"
import { accounts_url } from "../graphql/__generated__/accounts_url.graphql"
import { graphql } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"

export const readIdentifiers = inlineFragmentize<accounts_url>(
  graphql`
    fragment accounts_url on AccountType @inline {
      address
      user {
        publicUsername
      }
    }
  `,
  identifiers => identifiers,
)

export const getAccountLink = (
  ref: accounts_url | _FragmentRefs<"accounts_url">,
) => {
  const { address, user } = readIdentifiers(ref)
  return `/${user?.publicUsername ?? address}`
}
