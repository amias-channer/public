import React from "react"
import styled, { css } from "styled-components"
import AppContainer from "../../../containers/AppContainer.react"
import Input from "../../../design-system/Input"
import {
  AssetSearchQueryResponse,
  SearchSortBy,
} from "../../../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { CollectionSort } from "../../../lib/graphql/__generated__/CollectionFilterQuery.graphql"
import { pluralize } from "../../../lib/helpers/stringUtils"
import { appendClassName, selectClassNames } from "../../../lib/helpers/styling"
import ActionButton from "../../common/ActionButton.react"
import Icon from "../../common/Icon.react"
import { sizeMQ } from "../../common/MediaQuery.react"
import VerticalAligned from "../../common/VerticalAligned.react"
import Panel from "../../layout/Panel.react"
import FilterButton from "../FilterButton.react"
import { FilterDrawer } from "../FilterDrawer.react"
import AssetSearch, { AssetSearchVariables } from "./AssetSearch.react"
import { getFilterCount } from "./AssetSearchFilter"
import AssetSearchModelDropdown from "./AssetSearchModelDropdown.react"
import AssetSearchSortDropdown from "./AssetSearchSortDropdown.react"

interface Props {
  filterClassName?: string
  resultsClassName?: string
  sortOptions: SearchSortBy[]
  collectionSortBy?: CollectionSort
  data: AssetSearchQueryResponse["query"] | null
  defaultState?: Partial<AssetSearchVariables>
  fixedState?: Partial<AssetSearchVariables>
  initialState: Partial<AssetSearchVariables>
  navbar?: React.ReactNode
  path?: string
  collectionPanelMode?: Panel["props"]["mode"]
  showContextMenu?: boolean
  showSetPrivacyButton?: boolean
  showFilter?: boolean
  showModelDropdown?: boolean
  showPills?: boolean
  showSelector?: boolean
  showSellButtons?: boolean
  showEmptyView?: boolean
  sidebarCollapsed?: boolean
  useAppContainer?: boolean
  useCollectionMetadata?: boolean
  hideAssetCount?: boolean
  includeCollectionFilter?: boolean
  includeCategoryFilter?: boolean
  isStaff?: boolean
  variant?: "default" | "profile"
}

interface State {
  query: string
  isFilterDrawerOpen: boolean
}

export default class AssetSearchView extends React.Component<Props, State> {
  state: State = {
    query: this.props.initialState.query || "",
    isFilterDrawerOpen: false,
  }

  render() {
    const {
      resultsClassName,
      sortOptions,
      data,
      filterClassName,
      defaultState,
      fixedState,
      initialState,
      navbar,
      path,
      collectionPanelMode,
      showContextMenu,
      showFilter,
      showModelDropdown,
      showPills,
      showSelector,
      showSellButtons,
      showEmptyView,
      sidebarCollapsed,
      useAppContainer,
      useCollectionMetadata,
      hideAssetCount,
      collectionSortBy = "ASSET_COUNT",
      includeCollectionFilter,
      includeCategoryFilter,
      isStaff,
      variant = "default",
    } = this.props

    const { query, isFilterDrawerOpen } = this.state
    return (
      <DivContainer>
        <AssetSearch
          collectionPanelMode={collectionPanelMode}
          collectionSortBy={collectionSortBy}
          data={data}
          defaultState={defaultState}
          fixedState={fixedState}
          hideAssetCount={hideAssetCount}
          includeCategoryFilter={includeCategoryFilter}
          includeCollectionFilter={includeCollectionFilter}
          initialState={initialState}
          path={path}
          showContextMenu={showContextMenu}
          showSelector={showSelector}
          showSellButtons={showSellButtons}
          sidebarCollapsed={sidebarCollapsed}
          onClear={() => this.setState({ query: "" })}
        >
          {({
            Assets,
            Filter,
            Metadata,
            Pills,
            Selection,
            clear,
            state,
            totalCount,
            update,
          }) => {
            const filterCount = getFilterCount(state, {
              includeCollectionFilter,
            })

            const children = (
              <div className="AssetSearchView--main">
                {useCollectionMetadata ? <Metadata /> : null}
                {showFilter
                  ? variant === "default" && (
                      <Filter className={filterClassName} />
                    )
                  : null}
                <div
                  className={appendClassName(
                    "AssetSearchView--results",
                    resultsClassName,
                  )}
                >
                  {navbar}
                  <div className="AssetSearchView--results-header">
                    {useAppContainer ? null : (
                      <Input
                        className="AssetSearchView--search-container"
                        placeholder="Search"
                        startEnhancer={
                          <VerticalAligned marginRight="8px">
                            <Icon size={24} value="search" />
                          </VerticalAligned>
                        }
                        value={query}
                        onChange={e => this.setState({ query: e.target.value })}
                        onEnter={query => update({ query: `${query}` })}
                      />
                    )}
                    {variant === "default" && (
                      <div className="AssetSearchView--results-count">
                        {totalCount || totalCount === 0 ? (
                          <span>
                            {totalCount?.toLocaleString()}{" "}
                            {pluralize("result", totalCount)}
                          </span>
                        ) : (
                          <span>Loading results...</span>
                        )}
                      </div>
                    )}
                    <div className="AssetSearchView--results-header-dropdowns">
                      {showModelDropdown && (
                        <AssetSearchModelDropdown
                          model={state.resultModel || undefined}
                          setModel={resultModel => update({ resultModel })}
                          style={{ marginRight: "8px", height: "50px" }}
                        />
                      )}

                      <AssetSearchSortDropdown
                        isStaff={isStaff}
                        setSort={update}
                        sort={state}
                        sortOptions={sortOptions}
                        style={{ height: "50px" }}
                      />

                      {variant === "profile" && (
                        <>
                          <FilterDrawer
                            clearAll={clear}
                            data-testid="AssetSearchView--filter-sidebar"
                            isOpen={isFilterDrawerOpen}
                            onClose={() =>
                              this.setState({ isFilterDrawerOpen: false })
                            }
                          >
                            {() => (
                              <Filter
                                className={filterClassName}
                                renderFn={renderContent =>
                                  renderContent(() =>
                                    this.setState({
                                      isFilterDrawerOpen: false,
                                    }),
                                  )
                                }
                                variant="lazy"
                              />
                            )}
                          </FilterDrawer>
                          <FilterButton
                            count={filterCount}
                            marginLeft="16px"
                            onClick={() =>
                              this.setState({ isFilterDrawerOpen: true })
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                  {showPills && (
                    <div className="AssetSearchView--results-header-pills">
                      <Pills showResultCount={false} />
                    </div>
                  )}

                  {showSelector && <Selection />}
                  {totalCount === 0 ? (
                    <div
                      className={selectClassNames("AssetSearchView", {
                        "no-results": true,
                        "no-results-show": totalCount === 0,
                      })}
                    >
                      {query || showEmptyView ? (
                        <>
                          No items found for this search
                          <div className="AssetSearchView--no-results-action-area">
                            <ActionButton
                              className="AssetSearchView--no-results-cta"
                              onClick={clear}
                            >
                              Back To All Items
                            </ActionButton>
                          </div>
                        </>
                      ) : (
                        "No items to display"
                      )}
                    </div>
                  ) : (
                    <Assets className="AssetsSearchView--assets" isMultiline />
                  )}
                </div>
              </div>
            )
            if (useAppContainer) {
              return (
                <AppContainer
                  activeCollectionSlug={state.collection || undefined}
                  className="AssetSearchView--main"
                  hideFooter
                  searchQuery={state.query || undefined}
                  setCollectionSlug={collection =>
                    update({
                      collection,
                      collections: collection ? [collection] : [],
                    })
                  }
                  setSearchQuery={query => update({ query })}
                >
                  {children}
                </AppContainer>
              )
            }
            return children
          }}
        </AssetSearch>
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  .AssetSearchView--main {
    width: 100%;
    .AssetsSearchView--assets {
      ${sizeMQ({
        mobile: css`
          padding: 16px 0px 16px 0px;
        `,
      })}
    }
    .AssetSearchView--results {
      min-width: 0;
      padding-bottom: 80px;
    }
    .AssetSearchView--results-count {
      display: none;
    }
    .AssetSearchView--results-header {
      margin: 8px auto 16px auto;
      max-width: calc(88vw);
      .AssetSearchView--search-container {
        flex: 1 0;
        margin: 15px 0 8px;
      }
      .AssetSearchView--results-header-dropdowns {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
        z-index: 3;
        max-width: 100%;
        .AssetSearchView--results-header-dropdown {
          flex: 1 0;
          margin: 0 4px;
          width: 175px;
        }
      }
    }
    .AssetSearchView--no-results {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 10px;
      font-size: 20px;
      height: 0;
      opacity: 0;
      &.AssetSearchView--no-results-show {
        height: initial;
        margin-top: 32px;
        opacity: 1;
        transition: height 0ms 400ms, opacity 400ms 400ms;
        .AssetSearchView--no-results-cta {
          pointer-events: initial;
        }
      }
      .AssetSearchView--no-results-action-area {
        margin-top: 24px;
        max-width: 200px;
      }
      .AssetSearchView--no-results-cta {
        font-size: 14px;
        font-variant-caps: initial;
        pointer-events: none;
      }
    }
  }
  ${sizeMQ({
    tabletS: css`
      .AssetSearchView--main {
        .AssetSearchView--results-count {
          display: block;
        }
      }
    `,
    mobile: css`
      .AssetSearchView--main {
        display: flex;
        .AssetSearchView--results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 24px 0 10px 0;
          max-width: none;
          .AssetSearchView--results-header-dropdowns {
            margin-left: 0;
            margin-top: 0px;
            .AssetSearchView--results-header-dropdown {
              margin: 0 8px 0 0;
            }
          }
        }
        .AssetSearchView--no-results {
          font-size: 28px;
          &.AssetSearchView--no-results-show {
            border: 1px solid ${props => props.theme.colors.border};
            height: 248px;
            margin: 24px 12px 24px 8px;
          }
          .AssetSearchView--no-results-cta {
            font-size: 16px;
          }
        }
        .AssetSearchView--results {
          flex: 1 0;
          .AssetSearchView--results-collection {
            position: sticky;
            top: 64px;
            z-index: 4;
          }
          .AssetSearchView--results-header {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0 8px;
            .AssetSearchView--search-container {
              margin: 8px 16px 8px 0;
            }
        }
      }
      .AssetSearchView--results-header-pills {
        display: flex;
        margin: 24px 0 0 8px;
      }
    `,
  })}
`
