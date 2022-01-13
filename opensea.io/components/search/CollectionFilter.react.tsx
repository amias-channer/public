import React from "react"
import _ from "lodash"
import styled from "styled-components"
import AppComponent from "../../AppComponent.react"
import ScrollingPaginator from "../../design-system/ScrollingPaginator"
import { CollectionFilter_data } from "../../lib/graphql/__generated__/CollectionFilter_data.graphql"
import { CollectionFilterQuery } from "../../lib/graphql/__generated__/CollectionFilterQuery.graphql"
import {
  getNodes,
  graphql,
  Node,
  paginate,
  PaginationProps,
} from "../../lib/graphql/graphql"
import { shortSymbolDisplay } from "../../lib/helpers/numberUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import throttle from "../../lib/helpers/throttle"
import Icon, { MaterialIcon } from "../common/Icon.react"
import Image from "../common/Image.react"
import Panel from "../layout/Panel.react"
import Scrollbox from "../layout/Scrollbox.react"
import SearchInput from "./SearchInput.react"

const PAGE_SIZE = 100

interface Props {
  className?: string
  data: CollectionFilter_data | null
  icon?: MaterialIcon
  panelMode: Panel["props"]["mode"]
  selectedSlugs: string[]
  setSlugs: (slugs: string[] | undefined) => unknown
  shouldHighlightSelected?: boolean
  showScrollbox?: boolean
  hideAssetCount?: boolean
  title: "Categories" | "Collections"
}

interface State {
  query: string
}

const Item = ({
  collection: { imageUrl, name, assetCount },
  shouldHighlightSelected,
  isHidden,
  isSelected,
  onClick,
  hideAssetCount,
}: {
  collection: {
    assetCount?: number | null
    imageUrl: string | null
    name: string
  }
  isHidden?: boolean
  isSelected: boolean
  onClick: () => unknown
  shouldHighlightSelected?: boolean
  hideAssetCount?: boolean
}) => (
  <div
    className={selectClassNames("CollectionFilter", {
      isHidden,
      isHighlighted: isSelected && shouldHighlightSelected,
      isSelected,
      item: true,
    })}
    onClick={onClick}
  >
    <Image
      className="CollectionFilter--item-image"
      size={32}
      sizing="cover"
      url={
        isSelected && !shouldHighlightSelected
          ? "/static/images/checkmark.svg"
          : imageUrl || undefined
      }
      variant="round"
    />
    <div className="CollectionFilter--item-name">{name}</div>
    {isSelected && shouldHighlightSelected ? (
      <Icon className="CollectionFilter--cancel" value="close" />
    ) : assetCount && !hideAssetCount ? (
      <div className="CollectionFilter--item-asset-count">
        {shortSymbolDisplay(assetCount, {
          threshold: 1_000_000_000,
          formatDisplay: true,
        })}
      </div>
    ) : null}
  </div>
)

class CollectionFilter extends AppComponent<
  Props & PaginationProps<CollectionFilterQuery>,
  State
> {
  state: State = {
    query: "",
  }

  fetch = throttle(() => {
    const { refetch } = this.props
    const { query } = this.state
    refetch(PAGE_SIZE, { query })
  })

  search = (query: string) =>
    this.setState({ query }, () => this.fetch(undefined, { force: !query }))

  renderItems(relevantSet: Node<CollectionFilter_data["collections"]>[]) {
    const { hideAssetCount, selectedSlugs, setSlugs, shouldHighlightSelected } =
      this.props
    const shouldCollapseUnselected =
      shouldHighlightSelected && selectedSlugs.length === 1

    return relevantSet.map(collection => {
      // Shows the checkmark as the collection image if it's selected.
      const isSelected = selectedSlugs.includes(collection.slug)
      return (
        <Item
          collection={collection}
          hideAssetCount={hideAssetCount}
          isHidden={
            shouldCollapseUnselected && relevantSet[0].slug !== collection.slug
          }
          isSelected={isSelected}
          key={collection.slug}
          shouldHighlightSelected={shouldHighlightSelected}
          onClick={() => {
            // When an item is clicked, either remove it or add it to the selected collections.
            const newCollections: string[] = isSelected
              ? selectedSlugs.filter(c => c !== collection.slug)
              : [...selectedSlugs, collection.slug]
            setSlugs(newCollections?.length ? newCollections : undefined)
          }}
        />
      )
    })
  }

  render() {
    const {
      className,
      data,
      icon,
      page,
      panelMode,
      selectedSlugs,
      showScrollbox,
      title,
    } = this.props
    const { query } = this.state

    const uniqueCollections = _.uniqBy(
      [...getNodes(data?.selectedCollections), ...getNodes(data?.collections)],
      c => c.slug,
    )
    const sortedCollections = [
      ...uniqueCollections.filter(c => selectedSlugs.includes(c.slug)),
      ...uniqueCollections.filter(c => !selectedSlugs.includes(c.slug)),
    ]

    return (
      <DivContainer className={className}>
        <Panel icon={icon} mode={panelMode} title={this.tr(title)}>
          <React.Fragment>
            {showScrollbox ? (
              <div>
                <SearchInput
                  className="CollectionFilter--search"
                  placeholder="Filter"
                  query={query}
                  onChange={this.search}
                />
                <Scrollbox className="CollectionFilter--results">
                  {this.renderItems(sortedCollections)}
                  <ScrollingPaginator
                    disableLoader={!!sortedCollections.length}
                    intersectionOptions={{ rootMargin: "512px" }}
                    page={page}
                    size={PAGE_SIZE}
                  />
                </Scrollbox>
              </div>
            ) : (
              this.renderItems(sortedCollections)
            )}
          </React.Fragment>
        </Panel>
      </DivContainer>
    )
  }
}

export default paginate<CollectionFilterQuery, Props>(CollectionFilter, {
  fragments: {
    data: graphql`
      fragment CollectionFilter_data on Query
      @argumentDefinitions(
        assetOwner: { type: "IdentityInputType" }
        assetCreator: { type: "IdentityInputType" }
        onlyPrivateAssets: { type: "Boolean" }
        categories: { type: "[CollectionSlug!]" }
        chains: { type: "[ChainScalar!]" }
        collections: { type: "[CollectionSlug!]" }
        count: { type: "Int", defaultValue: 100 }
        cursor: { type: "String" }
        includeHidden: { type: "Boolean" }
        query: { type: "String" }
        sortBy: { type: "CollectionSort", defaultValue: SEVEN_DAY_VOLUME }
      ) {
        selectedCollections: collections(
          first: 25
          collections: $collections
          includeHidden: true
        ) {
          edges {
            node {
              assetCount
              imageUrl
              name
              slug
            }
          }
        }
        collections(
          after: $cursor
          assetOwner: $assetOwner
          assetCreator: $assetCreator
          onlyPrivateAssets: $onlyPrivateAssets
          chains: $chains
          first: $count
          includeHidden: $includeHidden
          parents: $categories
          query: $query
          sortBy: $sortBy
        ) @connection(key: "CollectionFilter_collections") {
          edges {
            node {
              assetCount
              imageUrl
              name
              slug
            }
          }
        }
      }
    `,
  },
  query: graphql`
    query CollectionFilterQuery(
      $assetOwner: IdentityInputType
      $categories: [CollectionSlug!]
      $chains: [ChainScalar!]
      $collections: [CollectionSlug!]
      $count: Int
      $cursor: String
      $includeHidden: Boolean
      $query: String
      $sortBy: CollectionSort
    ) {
      query {
        ...CollectionFilter_data
          @arguments(
            assetOwner: $assetOwner
            categories: $categories
            chains: $chains
            collections: $collections
            count: $count
            cursor: $cursor
            includeHidden: $includeHidden
            query: $query
            sortBy: $sortBy
          )
      }
    }
  `,
})

const DivContainer = styled.div`
  user-select: none;

  .CollectionFilter--search {
    margin-bottom: 12px;
  }

  .CollectionFilter--results {
    max-height: 220px;
    padding: 8px 0;
  }

  .CollectionFilter--item {
    align-items: center;
    color: ${props => props.theme.colors.text.body};
    cursor: pointer;
    display: flex;
    height: 40px;
    padding: 0 8px;

    .CollectionFilter--item-image {
      min-width: 32px;
      border: 1px solid ${props => props.theme.colors.border};
    }

    &.CollectionFilter--isSelected {
      .CollectionFilter--item-image {
        background-color: ${props => props.theme.colors.surface};
        opacity: 1;
        padding: 8px;
      }
    }

    &.CollectionFilter--isHighlighted {
      background-color: ${props => props.theme.colors.background};
      border-radius: 5px;
      cursor: pointer;
      height: 50px;
      margin-top: 0;

      .CollectionFilter--item-image {
        padding: 5px;
      }

      .CollectionFilter--cancel {
        margin-left: auto;
        color: ${props => props.theme.colors.withOpacity.text.body.medium};
      }

      &:hover {
        .CollectionFilter--cancel {
          transform: scale(1.1);
          color: ${props => props.theme.colors.text.body};
        }
      }
    }

    &.CollectionFilter--isHidden {
      display: none;
    }

    @media (hover: hover) {
      &:hover {
        color: ${props => props.theme.colors.text.on.background};
        .CollectionFilter--item-image {
          transform: scale(1.1);
        }
      }
    }

    .CollectionFilter--item-name {
      font-weight: 400;
      margin-left: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .CollectionFilter--item-asset-count {
      margin-left: auto;
    }
  }
`
