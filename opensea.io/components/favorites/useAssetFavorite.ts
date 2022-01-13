import { useCallback, useReducer } from "react"
import { useUpdateEffect } from "react-use"
import { ConnectionHandler } from "relay-runtime"
import useAppContext from "../../hooks/useAppContext"
import useToasts from "../../hooks/useToasts"
import {
  trackFavorite,
  trackUnfavorite,
} from "../../lib/analytics/events/favoriteEvents"
import { useAssetFavorite__data } from "../../lib/graphql/__generated__/useAssetFavorite__data.graphql"
import { useAssetFavoriteMutation } from "../../lib/graphql/__generated__/useAssetFavoriteMutation.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { UnreachableCaseError } from "../../lib/helpers/type"

graphql`
  fragment useAssetFavorite__data on AssetType {
    isFavorite
    favoritesCount
  }
`

type Action =
  | { type: "TOGGLE_FAVORITE" }
  | { type: "SET_IS_FAVORITING"; isFavoriting: boolean }
  | { type: "UPDATE"; isFavorite: boolean; favoritesCount: number }

type State = {
  isFavorite: boolean
  favoritesCount: number
  isFavoriting: boolean
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_FAVORITE": {
      return {
        ...state,
        isFavorite: !state.isFavorite,
        favoritesCount: state.isFavorite
          ? state.favoritesCount - 1
          : state.favoritesCount + 1,
      }
    }
    case "SET_IS_FAVORITING": {
      return { ...state, isFavoriting: action.isFavoriting }
    }
    case "UPDATE": {
      return {
        ...state,
        isFavorite: action.isFavorite,
        favoritesCount: action.favoritesCount,
      }
    }
    default: {
      throw new UnreachableCaseError(action)
    }
  }
}

type Props = {
  assetId: string
  isFavoriteInitial: boolean
  favoriteCountInitial: number
}

export const useAssetFavorite = ({
  assetId,
  isFavoriteInitial,
  favoriteCountInitial,
}: Props) => {
  const { isAuthenticated, mutate, wallet } = useAppContext()
  const { attempt } = useToasts()
  const [{ isFavorite, favoritesCount, isFavoriting }, dispatch] = useReducer(
    reducer,
    {
      isFavoriting: false,
      isFavorite: isFavoriteInitial,
      favoritesCount: favoriteCountInitial,
    },
  )

  useUpdateEffect(() => {
    dispatch({
      type: "UPDATE",
      favoritesCount: favoriteCountInitial,
      isFavorite: isFavoriteInitial,
    })
  }, [isFavoriteInitial, favoriteCountInitial])

  const mutateIsFavorite = useCallback(
    (asset: string, isFavorite: boolean) => {
      return mutate<useAssetFavoriteMutation>(
        graphql`
          mutation useAssetFavoriteMutation(
            $asset: AssetRelayID!
            $isFavorite: Boolean!
          ) {
            assets {
              updateFavorite(asset: $asset, isFavorite: $isFavorite)
            }
          }
        `,
        { asset, isFavorite },
        {
          shouldAuthenticate: true,
          before: () => dispatch({ type: "TOGGLE_FAVORITE" }), // optimistic update
          updater: store => {
            const assetRecord = store.get<useAssetFavorite__data>(asset)
            // Update properties on asset record
            assetRecord?.setValue(
              favoritesCount + (isFavorite ? 1 : -1),
              "favoritesCount",
            )
            assetRecord?.setValue(isFavorite, "isFavorite")

            // Add or remove account edge in AssetType favoritedBy connection
            const connectionID = ConnectionHandler.getConnectionID(
              asset,
              "AssetFavoritedByList_asset_favoritedBy",
            )
            const connectionRecord = store.get(connectionID)
            if (!connectionRecord) {
              return
            }
            if (!wallet.activeAccount) {
              return
            }

            // Get account record for current account
            const newAccountRecord = store.get(wallet.activeAccount.relayId)
            if (!newAccountRecord) {
              return
            }

            if (isFavorite) {
              // Create new edge
              const newEdge = ConnectionHandler.createEdge(
                store,
                connectionRecord,
                newAccountRecord,
                "AccountTypeEdge" /* GraphQl Type for edge */,
              )

              // Insert new edge at start of connection
              ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge)
            } else {
              // Remove edge for current account
              ConnectionHandler.deleteNode(
                connectionRecord,
                wallet.activeAccount.relayId,
              )
            }
          },
        },
      )
    },
    [favoritesCount, mutate, wallet],
  )

  const toggleIsFavorite = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (isFavoriting) {
        return
      }
      dispatch({ type: "SET_IS_FAVORITING", isFavoriting: true })
      const nextIsFavorite = !isFavorite
      const trackingParams = { assetId: assetId, isAuthenticated }
      if (nextIsFavorite) {
        trackFavorite(trackingParams)
      } else {
        trackUnfavorite(trackingParams)
      }
      try {
        await attempt(() => mutateIsFavorite(assetId, nextIsFavorite), {
          rethrow: true,
        })
      } catch (_) {
        dispatch({ type: "TOGGLE_FAVORITE" }) // revert optimistic update on failure
      } finally {
        dispatch({ type: "SET_IS_FAVORITING", isFavoriting: false })
      }
    },
    [
      isFavorite,
      assetId,
      dispatch,
      isFavoriting,
      isAuthenticated,
      attempt,
      mutateIsFavorite,
    ],
  )

  return { toggleIsFavorite, favoritesCount, isFavorite, isAuthenticated }
}
