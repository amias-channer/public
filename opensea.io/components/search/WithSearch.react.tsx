import React from "react"
import { ChainIdentifier } from "../../constants"
import { captureNoncriticalError } from "../../lib/analytics/analytics"
import { trackSearch } from "../../lib/analytics/events/searchEvents"
import {
  CollectionSort,
  IdentityInputType,
  PriceFilterType,
  SafelistRequestStatus,
  SearchResultModel,
  SearchSortBy,
  SearchToggle,
  TraitInputType,
  TraitRangeType,
} from "../../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { EventType } from "../../lib/graphql/__generated__/assetsQuery.graphql"
import { keys } from "../../lib/helpers/object"
import Router from "../../lib/helpers/router"
import throttle from "../../lib/helpers/throttle"
import QP from "../../lib/qp/qp"

export type Search = {
  categories?: string[]
  chains?: ChainIdentifier[]
  collection?: string
  collectionQuery?: string
  collectionSortBy?: CollectionSort
  collections?: string[]
  eventTypes?: EventType[]
  identity?: IdentityInputType
  includeHiddenCollections?: boolean
  isSingleCollection?: boolean
  numericTraits?: TraitRangeType[]
  paymentAssets?: string[]
  priceFilter?: PriceFilterType
  query?: string
  resultModel?: SearchResultModel
  sortAscending?: boolean
  sortBy?: SearchSortBy
  stringTraits?: TraitInputType[]
  toggles?: SearchToggle[]
  safelistRequestStatuses?: SafelistRequestStatus[]
}

type State<T extends Search> = {
  searchState: T
  isDataStale: boolean
  hasError: boolean
}

export type SearchType = "OfferSearch" | "ActivitySearch" | "AssetSearch"

type BaseProps<T extends Search> = {
  defaultState: T
  fixedState?: Partial<T>
  initialState: Partial<T>
  path?: string
  type?: SearchType
  onClear?: () => unknown
  onSearch: (searchState: T) => unknown
}

export type SearchProps<T extends Search> = State<T> & {
  clear: () => unknown
  update: (searchState: Partial<T>) => Promise<unknown>
}

const withSearch = <T extends Search, Props>(
  Component: React.ComponentType<Props & SearchProps<T>>,
) =>
  class Search extends React.Component<Props & BaseProps<T>, State<T>> {
    pollingInterval?: number

    state: State<T> = {
      isDataStale: false,
      hasError: false,
      searchState: {
        ...this.props.defaultState,
        ...this.props.initialState,
        ...this.props.fixedState,
      },
    }
    unsubRouter?: () => unknown

    componentDidMount() {
      setTimeout(() => {
        this.unsubRouter = Router.onChange(async () => {
          const { fixedState, onSearch } = this.props
          const { search } = QP.parse({ search: QP.Optional(QP.Search) })
          const slug = Router.getPathParams().collectionSlug
          const searchState: T = {
            ...this.state.searchState,
            collections: slug ? [slug] : [],
            ...search,
            ...fixedState,
            collection: slug,
            safelistRequestStatuses:
              this.state.searchState.query ||
              this.state.searchState.sortBy ||
              slug ||
              search?.collection ||
              search?.collections
                ? undefined
                : ["APPROVED", "VERIFIED"],
          }
          this.setState(
            {
              hasError: false,
              searchState,
            },
            () => {
              this.trackVisit()
            },
          )
          try {
            await onSearch(searchState)
          } catch (error) {
            captureNoncriticalError(error)
            this.setState({ hasError: true })
          }
          this.setState({ isDataStale: false })
        })
      }, 1)

      this.trackVisit()
    }

    componentDidUpdate(prevProps: Props & BaseProps<T>) {
      const { initialState } = this.props
      if (initialState !== prevProps.initialState) {
        this.setState(prevState => ({
          searchState: { ...initialState, ...prevState.searchState },
        }))
      }
    }

    componentWillUnmount() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
      }
      if (this.unsubRouter) {
        this.unsubRouter()
      }
    }

    trackVisit() {
      const { type } = this.props
      const { searchState } = this.state
      trackSearch({
        type,
        path: window.location.pathname,
        queryString: window.location.search,
        ...searchState,
      })
    }

    execute = throttle(
      async () => {
        const { defaultState, path } = this.props
        const { searchState } = this.state
        const search = { ...searchState }
        keys(search)
          .filter(
            k =>
              !((k as string) in defaultState) || defaultState[k] === search[k],
          )
          .forEach(k => {
            delete search[k]
          })
        delete search.collection
        if (!search.collections?.length || search.collections.length === 1) {
          delete search.collections
        }
        if (!search.categories?.length) {
          delete search.categories
        }
        const queryParams = { ...Router.getQueryParams(), search }
        scrollTo({ top: 0 })
        if (path) {
          if (searchState.collections?.length === 1) {
            Router.pushShallow(
              `${path}/${searchState.collections[0]}`,
              queryParams,
            )
          } else {
            Router.pushShallow(path as string, queryParams)
          }
        } else {
          Router.updateQueryParams(queryParams)
        }
      },
      { force: true },
    )

    update = (searchState: Partial<T>): Promise<void> =>
      new Promise(resolve =>
        this.setState(
          prevState => ({
            searchState: { ...prevState.searchState, ...searchState },
            // We set this pre-emptively before fetching for a more snappy and responsive experience
            isDataStale: true,
          }),
          () => resolve(undefined),
        ),
      ).then(this.execute)

    clear = async () => {
      const { defaultState, onClear } = this.props
      await this.update({ ...defaultState })
      if (onClear) {
        onClear()
      }
    }

    render() {
      return (
        <Component
          clear={this.clear}
          update={this.update}
          {...this.state}
          {...this.props}
        />
      )
    }
  }

export default withSearch
