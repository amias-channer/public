import React from "react"
import { times } from "lodash"
import styled, { css } from "styled-components"
import UserActions from "../actions/users"
import AppComponent from "../AppComponent.react"
import CollectionCard from "../components/collections/CollectionCard.react"
import CollectionManagerIndexHeader from "../components/collections/CollectionManagerIndexHeader.react"
import { sizeMQ } from "../components/common/MediaQuery.react"
import CollectionManager from "../components/layout/CollectionManager.react"
import Item from "../design-system/Item"
import Loader from "../design-system/Loader/Loader.react"
import ScrollingPaginator from "../design-system/ScrollingPaginator"
import Skeleton from "../design-system/Skeleton"
import { trackCreateCollection } from "../lib/analytics/events/collectionEvents"
import { trackCollectionManagerPage } from "../lib/analytics/events/pageEvents"
import { collectionManagerIndex_collections } from "../lib/graphql/__generated__/collectionManagerIndex_collections.graphql"
import { collectionManagerIndexQuery } from "../lib/graphql/__generated__/collectionManagerIndexQuery.graphql"
import {
  getNodes,
  graphql,
  GraphQLInitialProps,
  paginate,
  PaginationProps,
} from "../lib/graphql/graphql"
import GraphQLPage from "../lib/graphql/GraphQLPage.react"
import { Router } from "../lib/routes"
import { dispatch } from "../store"

const PAGE_SIZE = 12

interface Props {
  data: collectionManagerIndex_collections | null
  variables: collectionManagerIndexQuery["variables"]
}

export class CollectionManagerIndex extends AppComponent<
  Props & PaginationProps<collectionManagerIndexQuery>
> {
  async componentDidMount() {
    dispatch(UserActions.findCurrentWithoutAuth())
    trackCollectionManagerPage()
  }

  renderCollections() {
    const { data } = this.props
    const collections = getNodes(data?.collections)
    return collections.length ? (
      <div className="collectionManagerIndex--collection-cards">
        {collections.map((collection, ix) => (
          <CollectionCard
            dataKey={collection}
            key={ix}
            showContextMenu
            showTotalSupply
          />
        ))}
      </div>
    ) : null
  }

  renderSkeletons() {
    return (
      <div className="collectionManagerIndex--collection-cards">
        {times(PAGE_SIZE, index => (
          <Skeleton key={index}>
            <Skeleton.Row className="collectionManagerIndex--skeleton-image">
              <Skeleton.Block height="200px" width="150px" />
              <Skeleton.Block direction="rtl" height="200px" width="150px" />
            </Skeleton.Row>

            <Skeleton.Row className="collectionManagerIndex--skeleton-info">
              <Skeleton.Circle
                className="collectionManagerIndex--skeleton-circle"
                height="50px"
                variant="full"
                width="50px"
              />
              <Item
                className="collectionManagerIndex--skeleton-item"
                height="190px"
              >
                <Skeleton.Block className="collectionManagerIndex--skeleton-title" />
                <Skeleton.Block className="collectionManagerIndex--skeleton-subtitle" />
                <Skeleton.Block className="collectionManagerIndex--skeleton-text" />
                <Skeleton.Block className="collectionManagerIndex--skeleton-text" />
                <Skeleton.Block className="collectionManagerIndex--skeleton-text" />
              </Item>
            </Skeleton.Row>
          </Skeleton>
        ))}
      </div>
    )
  }

  onCollectionCreate = (slug: string) => {
    trackCreateCollection({ collectionSlug: slug })
    this.props.refetch(PAGE_SIZE)
  }

  render() {
    const { data, page } = this.props
    const collections = data?.collections

    const subtitle = (
      <CollectionManagerIndexHeader
        onClickCreate={() => Router.push("/collection/create")}
      />
    )

    return (
      <CollectionManagerContainer
        containerClassName="container"
        hasMargins
        subtitle={subtitle}
        title="My Collections"
      >
        <DivContainer>
          {collections ? this.renderCollections() : this.renderSkeletons()}
          <ScrollingPaginator
            intersectionOptions={{ rootMargin: "512px" }}
            page={page}
            size={PAGE_SIZE}
          >
            <div className="collectionManagerIndex--loader">
              <Loader size="large" />
            </div>
          </ScrollingPaginator>
        </DivContainer>
      </CollectionManagerContainer>
    )
  }
}

const CollectionManagerContainer = styled(CollectionManager)`
  margin-top: 40px;

  .CollectionManager--header-title {
    font-size: 40px;
    margin: 0 auto;
    text-align: center;
  }

  ${sizeMQ({
    tabletS: css`
      .CollectionManager--header-title {
        margin: 16px 32px 6px 0;
        text-align: left;
      }
    `,
  })}
`

const DivContainer = styled.div`
  .collectionManagerIndex--loader {
    flex-direction: column;
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 16px;
  }

  ${sizeMQ({
    phoneXs: css`
      .collectionManagerIndex--collection-cards > * {
        margin-bottom: 16px;
      }
    `,
    tabletS: css`
      .collectionManagerIndex--collection-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 20px;
      }
      .collectionManagerIndex--collection-cards > * {
        margin-bottom: 0;
      }
    `,
    tabletL: css`
      .collectionManagerIndex--collection-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
      }
    `,
  })}

  .collectionManagerIndex--skeleton-image {
    margin-bottom: -10px;
    border-top-left-radius: ${props => props.theme.borderRadius.default};
    border-top-right-radius: ${props => props.theme.borderRadius.default};
    width: 100%;
  }

  .collectionManagerIndex--skeleton-info {
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;

    ${sizeMQ({
      tabletS: css`
        margin-bottom: 0;
      `,
    })}

    .collectionManagerIndex--skeleton-circle {
      margin-top: -25px;
      z-index: 2;
    }

    .collectionManagerIndex--skeleton-item {
      margin-top: -25px;
      flex-direction: column;
      align-items: center;
      border-radius: ${props => props.theme.borderRadius.default};

      .collectionManagerIndex--skeleton-title {
        height: 24px;
        width: 75px;
        margin-top: 20px;
        border-radius: 12px;
      }

      .collectionManagerIndex--skeleton-subtitle {
        height: 16px;
        width: 150px;
        margin-top: 8px;
        margin-bottom: 10px;
        border-radius: 8px;
      }

      .collectionManagerIndex--skeleton-text {
        height: 12px;
        width: 60%;
        margin-top: 10px;
      }
    }
  }
`

const query = graphql`
  query collectionManagerIndexQuery($count: Int!, $cursor: String) {
    ...collectionManagerIndex_collections
  }
`

const CollectionManagerIndexPagination = paginate<
  collectionManagerIndexQuery,
  Props
>(CollectionManagerIndex, {
  fragments: {
    data: graphql`
      fragment collectionManagerIndex_collections on Query {
        collections(
          editor: {}
          first: $count
          after: $cursor
          sortBy: CREATED_DATE
        ) @connection(key: "collectionManagerIndex_collections") {
          edges {
            node {
              ...CollectionCard_data
            }
          }
        }
      }
    `,
  },
  query,
})

export default class CollectionManagerIndexContainer extends GraphQLPage<collectionManagerIndexQuery> {
  static query = query

  static getInitialProps =
    (): GraphQLInitialProps<collectionManagerIndexQuery> => ({
      variables: {
        count: PAGE_SIZE,
      },
    })

  render() {
    const { data, variables } = this.props
    return (
      <CollectionManagerIndexPagination data={data} variables={variables} />
    )
  }
}
