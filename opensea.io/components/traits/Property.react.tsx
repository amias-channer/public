import React from "react"
import { useFragment } from "react-relay"
import { Property_collection$key } from "../../lib/graphql/__generated__/Property_collection.graphql"
import { Property_trait$key } from "../../lib/graphql/__generated__/Property_trait.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { calculatePercentages } from "../../lib/helpers/numberUtils"
import Router from "../../lib/helpers/router"
import Link from "../common/Link.react"
import { PropertyCell } from "./PropertyCell.react"

interface Props {
  className?: string
  disablePercentages?: boolean
  trait: Property_trait$key
  collection: Property_collection$key
}

const Property = ({
  className,
  disablePercentages,
  trait: traitDataKey,
  collection: collectionDataKey,
}: Props) => {
  const collection = useFragment(
    graphql`
      fragment Property_collection on CollectionType {
        slug
        stats {
          totalSupply
        }
      }
    `,
    collectionDataKey,
  )

  const trait = useFragment(
    graphql`
      fragment Property_trait on TraitType {
        displayType
        traitCount
        traitType
        value
      }
    `,
    traitDataKey,
  )

  if (!trait.value) {
    return null
  }

  const { value, traitType, traitCount } = trait
  const {
    slug,
    stats: { totalSupply },
  } = collection

  return (
    <Link
      href={`/assets/${slug}${Router.stringifyQueryParams({
        search: { stringTraits: [{ name: traitType, values: [value] }] },
      })}`}
    >
      <PropertyCell
        className={className}
        count={traitCount || undefined}
        disablePercentages={disablePercentages}
        percentage={
          traitCount ? calculatePercentages(traitCount, totalSupply) : undefined
        }
        type={traitType}
        value={value}
      />
    </Link>
  )
}

export default Property
