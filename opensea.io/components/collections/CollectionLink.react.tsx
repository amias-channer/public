import React from "react"
import styled from "styled-components"
import { CollectionLink_collection } from "../../lib/graphql/__generated__/CollectionLink_collection.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { selectClassNames } from "../../lib/helpers/styling"
import Link from "../common/Link.react"

interface Props {
  collection: CollectionLink_collection
  isEditor?: boolean
  isSmall?: boolean
}

class CollectionLink extends React.Component<Props> {
  render() {
    const { collection, isSmall } = this.props

    return (
      <DivContainer>
        <Link
          className={selectClassNames("CollectionLink", {
            link: true,
            isSmall,
          })}
          href={`/collection/${collection.slug}`}
        >
          {collection.name}
        </Link>
      </DivContainer>
    )
  }
}

export default fragmentize(CollectionLink, {
  fragments: {
    collection: graphql`
      fragment CollectionLink_collection on CollectionType {
        slug
        name
        ...verification_data
      }
    `,
  },
})

const DivContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;

  &.CollectionLink--isEditor {
    display: inline-block;
  }

  .CollectionLink--link {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;

    &.CollectionLink--isSmall {
      font-size: 14px;
    }
  }
`
