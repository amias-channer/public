import React from "react"
import ReactMarkdown from "react-markdown"
import { useFragment } from "react-relay"
import styled, { css } from "styled-components"
import Block from "../../design-system/Block"
import Text from "../../design-system/Text"
import { CollectionCard_data$key } from "../../lib/graphql/__generated__/CollectionCard_data.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { getCollectionUrl } from "../../lib/helpers/collection"
import { pluralize } from "../../lib/helpers/stringUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import CarouselCard from "../common/CarouselCard.react"
import ConditionalWrapper from "../common/ConditionalWrapper.react"
import Image from "../common/Image.react"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"
import CollectionCardContextMenu from "./CollectionCardContextMenu"

interface Props {
  dataKey: CollectionCard_data$key
  containerClassName?: string
  requireBannerImage?: boolean
  showContextMenu?: boolean
  showTotalSupply?: boolean
}

const CollectionCard = ({
  containerClassName,
  dataKey,
  requireBannerImage,
  showContextMenu,
  showTotalSupply,
}: Props) => {
  const collection = useFragment(
    graphql`
      fragment CollectionCard_data on CollectionType {
        ...CollectionCardContextMenu_data
        ...collection_url
        description
        name
        shortDescription
        slug
        logo
        banner
        owner {
          displayName
          user {
            username
          }
        }
        stats {
          totalSupply
        }
      }
    `,
    dataKey,
  )

  const username = collection.owner?.user?.username
  const displayName = collection.owner?.displayName
  const bannerImage = collection.banner
  const logoImage = collection.logo
  const totalAssets = collection.stats.totalSupply

  return logoImage &&
    (requireBannerImage ? bannerImage : !requireBannerImage) ? (
    <Card
      containerClassName={containerClassName}
      contentClassName="CollectionCard--content"
      href={getCollectionUrl(collection)}
      imageHeight={200}
      imageUrl={bannerImage!}
      key={collection.slug}
    >
      <Image
        className="CollectionCard--round-image"
        size={50}
        sizing="cover"
        url={logoImage}
        variant="round"
      />
      {showContextMenu && (
        <div className="CollectionCard--context-menu">
          <CollectionCardContextMenu dataKey={collection} />
        </div>
      )}
      <Text as="div" className="CollectionCard--name" variant="h4">
        {collection.name}
      </Text>
      {displayName ? (
        <Text
          className={selectClassNames("CollectionCard", {
            creator: true,
            withlink: !!username,
          })}
        >
          {`by `}
          <ConditionalWrapper
            condition={!!username}
            wrapper={children => <Link href={`/${username}`}>{children}</Link>}
          >
            {displayName}
          </ConditionalWrapper>
        </Text>
      ) : (
        <Block height="18px" />
      )}
      <Text as="span" className="CollectionCard--description">
        <ReactMarkdown linkTarget="_blank">
          {collection.description
            ? `${collection.description.substring(0, 100)}${
                collection.description.length > 100 ? "..." : ""
              }`
            : `Explore the ${collection.name} collection`}
        </ReactMarkdown>
      </Text>
      {showTotalSupply && (
        <Text className="CollectionCard--item-count" variant="small">
          {`${totalAssets} ${pluralize("item", totalAssets)}`}
        </Text>
      )}
    </Card>
  ) : null
}

export default CollectionCard

const Card = styled(CarouselCard)`
  position: relative;

  .CollectionCard--content {
    align-items: center;
    margin-top: -36px;
  }

  .CollectionCard--context-menu {
    display: block;

    ${sizeMQ({
      tabletS: css`
        display: none;
      `,
    })}
  }

  .CollectionCard--round-image {
    background-color: ${props => props.theme.colors.surface};
    border: 3px solid ${props => props.theme.colors.surface};
    box-shadow: rgb(14 14 14 / 60%) 0px 0px 2px 0px;
  }

  .CollectionCard--name {
    color: ${props => props.theme.colors.text.heading};
    font-weight: 600;
    font-size: 16px;
    text-transform: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    max-width: 200px;
    margin-top: 10px;
  }

  .CollectionCard--creator {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.subtle};
    margin: 0;
    text-transform: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    max-width: 200px;
  }

  .CollectionCard--description {
    font-size: 14px;
    font-weight: 400;
    max-width: 80%;
    margin: 20px 0;
    height: 66px;
    overflow: hidden;
    text-align: center;
    /* Allow only three lines of text  */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    /* Remove margin from any html elements with default margin values */
    p,
    ul,
    ol,
    dl,
    dd,
    blockquote,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
    }
  }

  .CollectionCard--item-count {
    margin-top: 0;
  }

  &:hover {
    .CollectionCard--context-menu {
      display: block;
    }
  }
`
