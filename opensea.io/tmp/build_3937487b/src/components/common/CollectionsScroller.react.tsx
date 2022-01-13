import React from "react"
import styled, { css } from "styled-components"
import Block from "../../design-system/Block"
import Item from "../../design-system/Item"
import Skeleton from "../../design-system/Skeleton"
import { useCarousel } from "../../hooks/useCarousel"
import {
  CollectionsScrollerQuery,
  CollectionsScrollerQueryResponse,
  CollectionsScrollerQueryVariables,
} from "../../lib/graphql/__generated__/CollectionsScrollerQuery.graphql"
import { getNodes, graphql } from "../../lib/graphql/graphql"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import CollectionCard from "../collections/CollectionCard.react"
import ContainedCarousel from "./ContainedCarousel"
import { sizeMQ } from "./MediaQuery.react"

interface Props {
  data?: CollectionsScrollerQueryResponse
  variables: CollectionsScrollerQueryVariables
}

const CollectionsScroller = ({ data }: Props) => {
  const { showArrows } = useCarousel()
  if (!data || !data.trendingCollections) {
    return (
      <Container>
        {new Array(!showArrows ? 6 : 12).fill(0).map(() => (
          <CollectionSkeleton key={Math.random()} />
        ))}
      </Container>
    )
  }
  const { trendingCollections } = data
  const showingTrendingCollections = !showArrows
    ? getNodes(trendingCollections).slice(0, 6)
    : getNodes(trendingCollections)
  return (
    <Container>
      {showingTrendingCollections.map((collection, idx) => (
        <CollectionCard
          containerClassName="CollectionsScroller--card-container"
          dataKey={collection}
          key={idx}
          requireBannerImage
        />
      ))}
    </Container>
  )
}

export default withData<CollectionsScrollerQuery, Props>(
  CollectionsScroller,
  graphql`
    query CollectionsScrollerQuery($categories: [CategorySlug!]) {
      trendingCollections(first: 12, categories: $categories) {
        edges {
          node {
            ...CollectionCard_data
          }
        }
      }
    }
  `,
)

const CollectionSkeleton = () => (
  <Block className="CollectionsScroller--card-container" width="100%">
    <Skeleton>
      <Skeleton.Row className="CollectionsScroller--skeleton-image">
        <Skeleton.Block height="200px" width="150px" />
        <Skeleton.Block direction="rtl" height="200px" width="150px" />
      </Skeleton.Row>

      <Skeleton.Row className="CollectionsScroller--skeleton-info">
        <Skeleton.Circle
          className="CollectionsScroller--skeleton-circle"
          height="50px"
          variant="full"
          width="50px"
        />
        <Item className="CollectionsScroller--skeleton-item" height="190px">
          <Skeleton.Block className="CollectionsScroller--skeleton-title" />
          <Skeleton.Block className="CollectionsScroller--skeleton-subtitle" />
          <Skeleton.Block className="CollectionsScroller--skeleton-text" />
          <Skeleton.Block className="CollectionsScroller--skeleton-text" />
          <Skeleton.Block className="CollectionsScroller--skeleton-text" />
        </Item>
      </Skeleton.Row>
    </Skeleton>
  </Block>
)

const Container = styled(ContainedCarousel)`
  .Carousel--left-arrow {
    left: -17px;
    top: 185px;
  }

  .Carousel--right-arrow {
    right: -17px;
    top: 185px;
  }

  .CollectionsScroller--card-container {
    padding: 10px;

    ${sizeMQ({
      tabletS: css`
        margin-bottom: 10px;
      `,
    })}
  }

  .CollectionsScroller--skeleton-image {
    margin-bottom: -10px;
    border-top-left-radius: ${props => props.theme.borderRadius.default};
    border-top-right-radius: ${props => props.theme.borderRadius.default};
    width: 100%;
  }

  .CollectionsScroller--skeleton-info {
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;

    ${sizeMQ({
      tabletS: css`
        margin-bottom: 0;
      `,
    })}

    .CollectionsScroller--skeleton-circle {
      margin-top: -25px;
      z-index: 2;
    }

    .CollectionsScroller--skeleton-item {
      margin-top: -25px;
      flex-direction: column;
      align-items: center;
      border-radius: ${props => props.theme.borderRadius.default};

      .CollectionsScroller--skeleton-title {
        height: 24px;
        width: 75px;
        margin-top: 20px;
        border-radius: 12px;
      }

      .CollectionsScroller--skeleton-subtitle {
        height: 16px;
        width: 150px;
        margin-top: 8px;
        margin-bottom: 10px;
        border-radius: 8px;
      }

      .CollectionsScroller--skeleton-text {
        height: 12px;
        width: 60%;
        margin-top: 10px;
      }
    }
  }
`
