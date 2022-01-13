import React, { useRef, useState } from "react"
import _ from "lodash"
import { useClickAway, useMedia } from "react-use"
import styled from "styled-components"
import { PLACEHOLDER_IMAGE } from "../../constants"
import Block from "../../design-system/Block"
import Dropdown, {
  RenderDropdownContentProps,
} from "../../design-system/Dropdown"
import { FramedList, ListItem } from "../../design-system/List"
import Loader from "../../design-system/Loader/Loader.react"
import useAppContext from "../../hooks/useAppContext"
import useIsOpen from "../../hooks/useIsOpen"
import useLockBodyScroll from "../../hooks/useLockBodyScroll"
import useSize from "../../hooks/useSize"
import {
  NavSearchAssetsQuery,
  NavSearchAssetsQueryResponse,
} from "../../lib/graphql/__generated__/NavSearchAssetsQuery.graphql"
import {
  NavSearchQuery,
  NavSearchQueryResponse,
} from "../../lib/graphql/__generated__/NavSearchQuery.graphql"
import { getFirstGraphqlResponseErrorMessage } from "../../lib/graphql/error"
import {
  fetch,
  getFirstNode,
  getNodes,
  graphql,
  Node,
} from "../../lib/graphql/graphql"
import { getAccountLink } from "../../lib/helpers/accounts"
import { flatMap } from "../../lib/helpers/array"
import { getAssetUrl } from "../../lib/helpers/asset"
import { shortSymbolDisplay } from "../../lib/helpers/numberUtils"
import Router from "../../lib/helpers/router"
import { sanitazeQuery } from "../../lib/helpers/search"
import { pluralize } from "../../lib/helpers/stringUtils"
import { readCollectionVerificationStatus } from "../../lib/helpers/verification"
import { $nav_height } from "../../styles/variables"
import { VerificationIcon } from "../collections/VerificationIcon.react"
import { BANNER_HEIGHT } from "../layout/home-page/AnnouncementBanner.react"
import SearchInput from "../search/SearchInput.react"
import AccountBadge from "./AccountBadge.react"
import { BREAKPOINTS_PX, maxWidthBreakpoint } from "./MediaQuery.react"
import VerticalAligned from "./VerticalAligned.react"

const DEBOUNCE_DELAY = 300
const MIN_CHARS_FOR_ASSET_SEARCH = 5

type Account = Node<NavSearchQueryResponse["accounts"]>
type Asset = NonNullable<Node<NavSearchAssetsQueryResponse["search"]>["asset"]>
type Collection = Node<NavSearchQueryResponse["collections"]>

const getCollectionRoute = ({ slug }: Collection): string => `/assets/${slug}`

interface Props {
  activeCollectionSlug?: string
  query: string
  setCollectionSlug?: (slug: string) => unknown
  setQuery?: (query: string) => unknown
  isBannerShown?: boolean
}

export const NavSearch = ({
  activeCollectionSlug,
  query: initialQuery,
  setCollectionSlug,
  setQuery: paramSetQuery,
  isBannerShown,
}: Props) => {
  const queryRef = useRef(initialQuery)
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [assets, setAssets] = useState<ReadonlyArray<Asset>>([])
  const [collections, setCollections] = useState<ReadonlyArray<Collection>>([])
  const [accounts, setAccounts] = useState<ReadonlyArray<Account>>([])
  const { isOpen: showResults, close, open, setIsOpen } = useIsOpen()
  const { isMobile } = useAppContext()
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const [searchContainerWidth] = useSize(searchContainerRef)
  const isMobileViewport = useMedia(
    maxWidthBreakpoint(BREAKPOINTS_PX.mobile),
    false,
  )
  const isEmpty =
    (collections?.length || accounts?.length || assets?.length) === 0

  useClickAway(searchContainerRef, e => {
    const node = e.target as HTMLElement
    if (resultsContainerRef.current?.contains(node)) {
      return
    }
    close()
  })

  const searchAssets = (query: string) => {
    if (sanitazeQuery(query).length < MIN_CHARS_FOR_ASSET_SEARCH) {
      return Promise.resolve()
    }

    return fetch<NavSearchAssetsQuery>(
      graphql`
        query NavSearchAssetsQuery($query: String!) {
          search(
            first: 4
            querystring: $query
            resultType: ASSETS
            excludeHiddenCollections: true
          ) {
            edges {
              node {
                asset {
                  ...asset_url
                  assetContract {
                    address
                    chain
                  }
                  imageUrl
                  name
                  relayId
                  tokenId
                }
              }
            }
          }
        }
      `,
      { query },
    ).then(({ search }) => {
      if (queryRef.current === query) {
        setAssets(flatMap(getNodes(search), r => (r.asset ? [r.asset] : [])))
      }
    })
  }

  const onChange = _.debounce(async (query: string) => {
    setAccounts([])
    setAssets([])
    setCollections([])
    setIsLoading(!!query)
    queryRef.current = query
    setIsOpen(!!query)
    setError(undefined)

    if (!query) {
      return
    }
    const promise = fetch<NavSearchQuery>(
      graphql`
        query NavSearchQuery($query: String!) {
          accounts(first: 4, query: $query) {
            edges {
              node {
                address
                config
                discordId
                imageUrl
                relayId
                user {
                  publicUsername
                }
                ...accounts_url
              }
            }
          }
          collections(
            first: 4
            query: $query
            sortBy: SEVEN_DAY_VOLUME
            includeHidden: true
          ) {
            edges {
              node {
                assetContracts(first: 100) {
                  edges {
                    node {
                      address
                    }
                  }
                }
                imageUrl
                name
                relayId
                slug
                stats {
                  totalSupply
                }
                ...verification_data
              }
            }
          }
        }
      `,
      { query },
    ).then(({ accounts, collections }) => {
      if (queryRef.current === query) {
        setAccounts(getNodes(accounts))
        setCollections(getNodes(collections))
      }
    })

    const assetsPromise = searchAssets(query)
    try {
      await Promise.all([promise, assetsPromise])
    } catch (error) {
      if (queryRef.current === query) {
        setError(
          getFirstGraphqlResponseErrorMessage(error) ??
            "An error occurred while searching.",
        )
      }
    } finally {
      if (queryRef.current === query) {
        setIsLoading(false)
      }
    }
  }, DEBOUNCE_DELAY)

  const setQuery = (query: string) => {
    const lowerCaseQuery = query.toLowerCase()
    const exactMatchingCollection =
      collections?.find(
        c =>
          getFirstNode(c.assetContracts)?.address.toLowerCase() ===
          lowerCaseQuery,
      ) || collections?.find(c => c.name.toLowerCase() === lowerCaseQuery)
    if (
      setCollectionSlug &&
      exactMatchingCollection?.slug &&
      !activeCollectionSlug
    ) {
      // `setCollectionSlug` is what happens when we have a graphql page
      // and we found a collection that matches the user's query
      // and there's no active collection.
      // We only route users to a collection when there's no `activeCollectionSlug`,
      // so that users can search for terms like "cryptokitties" in the MarbleCards collection.
      setCollectionSlug(exactMatchingCollection.slug)
    } else {
      if (paramSetQuery) {
        paramSetQuery(query)
      } else if (exactMatchingCollection) {
        Router.push(`/assets/${exactMatchingCollection.slug}`)
      } else {
        Router.push("/assets", query ? { search: { query } } : undefined)
      }
    }
    close()
  }

  const onFocus = () => {
    if (queryRef.current) {
      open()
    }
    if (queryRef.current && !isLoading && isEmpty) {
      onChange(queryRef.current)
    }
  }

  const renderSection = ({
    header,
    items,
    Item,
  }: {
    Item: typeof ListItem
    header: string
    items: Array<{
      title: React.ReactNode
      imageUrl: string | null
      key: string
      route: string
      side?: React.ReactNode
    }>
  }) => {
    if (!items.length) {
      return null
    }
    return (
      <>
        <Item
          style={{ borderWidth: 0, borderBottomWidth: 1, paddingBottom: 8 }}
        >
          <Item.Content>
            <Item.Description>{header}</Item.Description>
          </Item.Content>
        </Item>
        {items.map(({ title, imageUrl, key, route, side }) => (
          <Item
            href={route}
            key={key}
            style={{ border: "none", padding: 12 }}
            onClick={close}
          >
            <Item.Avatar
              $objectFit="initial"
              borderRadius="50%"
              src={imageUrl || PLACEHOLDER_IMAGE}
              style={{ marginRight: 8 }}
            />
            <Item.Content>
              <Item.Title display="flex">{title}</Item.Title>
            </Item.Content>
            {side && <Item.Side>{side}</Item.Side>}
          </Item>
        ))}
      </>
    )
  }

  const renderResults = ({
    List,
    Item,
  }: Omit<RenderDropdownContentProps, "close">) => {
    const Section = renderSection

    return (
      <List
        className="NavSearch--results"
        ref={resultsContainerRef}
        style={{
          maxWidth: "100%",
          width: isMobileViewport ? "100%" : searchContainerWidth,
        }}
      >
        <Section
          Item={Item}
          header="Collections"
          items={(collections || []).map(collection => {
            const { imageUrl, name, relayId, stats } = collection
            const verified =
              readCollectionVerificationStatus(collection) === "verified"
            return {
              title: (
                <>
                  <VerticalAligned>{name}</VerticalAligned>
                  {verified && (
                    <VerificationIcon
                      size="small"
                      verificationStatus="verified"
                    />
                  )}
                </>
              ),
              imageUrl,
              key: relayId,
              route: getCollectionRoute(collection),
              side: (
                <Item.Description>{`${shortSymbolDisplay(stats.totalSupply, {
                  threshold: 1_000_000_000,
                  formatDisplay: true,
                })} ${pluralize("item", stats.totalSupply)}`}</Item.Description>
              ),
            }
          })}
        />
        <Section
          Item={Item}
          header="Accounts"
          items={(accounts || []).map(account => {
            const { address, config, discordId, imageUrl, relayId, user } =
              account
            return {
              title: (
                <>
                  <VerticalAligned>
                    {user?.publicUsername || address}
                  </VerticalAligned>
                  <AccountBadge
                    config={config}
                    discordId={discordId}
                    isInteractive={false}
                  />
                </>
              ),
              imageUrl,
              key: relayId,
              route: getAccountLink(account),
            }
          })}
        />
        <Section
          Item={Item}
          header="Assets"
          items={(assets || []).map(asset => {
            const { imageUrl, name, relayId } = asset
            return {
              title: name,
              imageUrl,
              key: relayId,
              route: getAssetUrl(asset),
            }
          })}
        />

        {error ? (
          <Item>
            <Item.Content>
              <Item.Description color="error">{error}</Item.Description>
            </Item.Content>
          </Item>
        ) : (
          isLoading && (
            <Item justifyContent="center">
              <Loader />
            </Item>
          )
        )}
        {!isLoading && isEmpty ? (
          <Item>
            <Item.Content>
              <Item.Description>No items found</Item.Description>
            </Item.Content>
          </Item>
        ) : (
          <Item
            style={{ border: "none" }}
            onClick={() => setQuery(queryRef.current)}
          >
            <Item.Content>
              <Item.Description>
                Press Enter to search all items
              </Item.Description>
            </Item.Content>
          </Item>
        )}
      </List>
    )
  }

  return (
    <>
      <StyledContainer $isBannerShown={isBannerShown}>
        <Block height="45px">
          <Dropdown
            className="NavSearch--dropdown"
            content={renderResults}
            maxWidth={searchContainerWidth}
            offset={[0, 0]}
            visible={showResults && !isMobileViewport}
          >
            <SearchInput
              placeholder={
                isMobile
                  ? "Search OpenSea"
                  : "Search items, collections, and accounts"
              }
              query={queryRef.current}
              ref={searchContainerRef}
              setQuery={setQuery}
              slashKeyTrigger
              onChange={onChange}
              onClick={onFocus}
              onFocus={onFocus}
            />
          </Dropdown>
        </Block>
      </StyledContainer>
      {isMobileViewport && showResults && (
        <MobileOverlay isBannerShown={isBannerShown}>
          {renderResults({ List: FramedList, Item: ListItem })}
        </MobileOverlay>
      )}
    </>
  )
}

const MobileOverlay = ({
  children,
  isBannerShown,
}: {
  children: React.ReactNode
  isBannerShown?: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null)
  useLockBodyScroll(true, ref)
  return (
    <Overlay $isBannerShown={isBannerShown} ref={ref}>
      {children}
    </Overlay>
  )
}

const Overlay = styled.div<{ $isBannerShown?: boolean }>`
  overflow: auto;
  top: ${props =>
    props.$isBannerShown
      ? `calc(${$nav_height} + ${BANNER_HEIGHT})`
      : $nav_height};
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background};
`

const StyledContainer = styled(VerticalAligned)<{ $isBannerShown?: boolean }>`
  width: 100%;

  .NavSearch--dropdown {
    height: 100%;
    max-height: ${props =>
      `calc(100vh - (${$nav_height} + ${
        props.$isBannerShown ? BANNER_HEIGHT : "0px"
      }))`};
  }
`

export default NavSearch
