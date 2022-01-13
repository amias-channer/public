import React from "react"
import { useFragment } from "react-relay"
import { NumericTrait_collection$key } from "../../lib/graphql/__generated__/NumericTrait_collection.graphql"
import { NumericTrait_trait$key } from "../../lib/graphql/__generated__/NumericTrait_trait.graphql"
import { graphql } from "../../lib/graphql/graphql"
import Router from "../../lib/helpers/router"
import Link from "../common/Link.react"
import { NumericTraitCell } from "./NumericTraitCell.react"

interface Props {
  className?: string
  collection: NumericTrait_collection$key
  rankingMode?: boolean
  trait: NumericTrait_trait$key
}

const NumericTrait = ({
  className,
  rankingMode,
  trait: traitDataKey,
  collection: collectionDataKey,
}: Props) => {
  const trait = useFragment(
    graphql`
      fragment NumericTrait_trait on TraitType {
        displayType
        floatValue
        intValue
        maxValue
        traitType
      }
    `,
    traitDataKey,
  )

  const collection = useFragment(
    graphql`
      fragment NumericTrait_collection on CollectionType {
        numericTraits {
          key
          value {
            max
            min
          }
        }
        slug
      }
    `,
    collectionDataKey,
  )

  const value =
    trait.floatValue === null
      ? trait.intValue === null
        ? null
        : +trait.intValue
      : trait.floatValue
  if (value === null) {
    return null
  }
  const traitMax =
    trait.maxValue ||
    collection.numericTraits.find(t => t.key === trait.traitType)?.value.max

  return (
    <Link
      href={`/assets/${collection.slug}${Router.stringifyQueryParams({
        search: {
          numericTraits: [
            {
              name: trait.traitType,
              ranges: [{ min: value, max: value }],
            },
          ],
        },
      })}`}
    >
      <NumericTraitCell
        className={className}
        maxValue={traitMax}
        rankingMode={rankingMode}
        type={trait.traitType}
        value={value}
      />
    </Link>
  )
}

export default NumericTrait
