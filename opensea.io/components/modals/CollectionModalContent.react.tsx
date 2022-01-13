import React from "react"
import ReactMarkdown from "react-markdown"
import styled from "styled-components"
import Block from "../../design-system/Block"
import Modal from "../../design-system/Modal"
import { CollectionModalContent_data } from "../../lib/graphql/__generated__/CollectionModalContent_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import ActionButton from "../common/ActionButton.react"
import Image from "../common/Image.react"

interface Props {
  data: CollectionModalContent_data | null
}

export const CollectionModalContent = ({ data }: Props) => {
  const { description, imageUrl, name, slug } = data || {}
  return (
    <>
      <StyledBody>
        {imageUrl && (
          <Image
            className="CollectionModal--image"
            size={96}
            sizing="cover"
            url={imageUrl}
          />
        )}
        <div className="CollectionModal--name-text">{name}</div>
        <div className="CollectionModal--description-text">
          {description && (
            <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
          )}
        </div>
      </StyledBody>

      <Modal.Footer>
        <ActionButton href={`/collection/${slug}`} type="secondary">
          View Collection
        </ActionButton>
        <Block marginLeft="16px">
          <ActionButton href={`/activity/${slug}`} type="secondary">
            View Activity
          </ActionButton>
        </Block>
      </Modal.Footer>
    </>
  )
}

export default fragmentize(CollectionModalContent, {
  fragments: {
    data: graphql`
      fragment CollectionModalContent_data on CollectionType {
        description
        imageUrl
        name
        slug
      }
    `,
  },
})

const StyledBody = styled(Modal.Body)`
  .CollectionModal--image {
    margin: 0 auto;
    border-radius: 50%;
    height: 96px;
    width: 96px;
  }

  .CollectionModal--name-text {
    margin: 5px 0;
    text-align: center;
    font-size: 28px;
  }

  .CollectionModal--description-text {
    text-align: center;
    margin-bottom: 30px;
  }
`
