import { IncomingMessage, ServerResponse } from "http"
import { TokenStandardVersion } from "opensea-js/lib/types"
import qs from "qs"
import Web3 from "web3"
import { API_MESSAGE_404, IS_SERVER } from "../constants"
import Auth from "../lib/auth"
import Wallet from "../lib/chain/wallet"
import { ERC721, OpenSeaAsset } from "../lib/contracts"
import { Asset_data } from "../lib/graphql/__generated__/Asset_data.graphql"
import { promisify2 } from "../lib/helpers/promise"
import { Router } from "../lib/routes"
import Transport from "../lib/transport"
import { getGasPrice, confirmTransaction } from "../lib/wyvern"
import { Account } from "../reducers/accounts"
import { Filter } from "../reducers/assetlist"
import { Asset } from "../reducers/assets"
import { Action, AsyncAction } from "../store"
import ErrorActions from "./errors"
import ExchangeActions from "./exchange"
import FetchingActions from "./fetching"
import * as ActionTypes from "./index"

const AssetActions = {
  // TODO (joshuawu): This method is trying to handle too many different cases. Let's simplify this.
  /**
   * Find all assets matching criteria
   * @param filterParams params to send to the API for filtering and ordering
   * @param opts.resetFilter clear the existing filter and sort
   * @param opts.resetList clear the existing assets, wait for API with empty list
   */
  findAll:
    (
      filterParams: Filter,
      { resetFilter = false, resetList = true } = {},
    ): AsyncAction =>
    async dispatch => {
      dispatch(FetchingActions.start("Filtering and fetching assets..."))
      if (resetList) {
        dispatch({ type: ActionTypes.RESET_ASSET_LIST })
      }
      if (resetFilter) {
        dispatch({ type: ActionTypes.RESET_ASSET_FILTER })
      }
      await dispatch(AssetActions._filterAndFind(filterParams))
    },

  findOwnershipsForAsset:
    (asset: Asset, { address }: { address: string }): AsyncAction =>
    async dispatch => {
      try {
        const assetRequest = `/asset/${asset.tokenAddress}/${asset.tokenId}/?account_address=${address}`
        const data = await Transport.fetch(assetRequest)
        dispatch(AssetActions.receiveOwnership(data))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    },

  createVisitor:
    (asset: Asset, account: Account): AsyncAction =>
    async dispatch => {
      try {
        const assetRequest = `/asset/${asset.tokenAddress}/${asset.tokenId}/visitors/create/`
        const data = await Transport.sendJSON(assetRequest, {
          body: {
            address: account.address,
          },
        })
        // Handle wallet-specific data
        if (data.private_sell_orders && data.private_sell_orders.length) {
          dispatch({
            type: ActionTypes.UPDATE_ORDER,
            data: data.private_sell_orders[0],
          })
        }
      } catch (error) {
        // Error silently, since this isn't tied to UI
        console.error(error)
      }
    },

  saveFilter:
    (filter: Filter): AsyncAction =>
    async dispatch => {
      const query = { ...filter }
      const pathParts = [Router.pathname]
      if (query["category"]) {
        pathParts.push(String(query["category"]))
        delete query["category"]
      }
      const queryString = qs.stringify(query)
      Router.pushRoute(`${pathParts.join("/")}?${queryString}`)
      await dispatch(AssetActions.findAll(filter))
    },

  resetFilter: (): AsyncAction => async dispatch => {
    dispatch({ type: ActionTypes.RESET_ASSET_FILTER })
    Router.pushRoute(`${Router.pathname}`)
    await dispatch(AssetActions.findAll({}))
  },

  findAndAppendAll:
    (filterParams: Filter): AsyncAction =>
    async dispatch => {
      dispatch(FetchingActions.start("Fetching more assets..."))
      await dispatch(AssetActions._filterAndFind(filterParams, true))
    },

  findAllForAccount(address: string) {
    return AssetActions.findAll({ owner: address }, { resetFilter: true })
  },

  findAllForCurrentAccount: (): AsyncAction => async dispatch => {
    // Reset the list early to prevent flashes while we
    // await Network
    dispatch({ type: ActionTypes.RESET_ASSET_LIST })
    const mainAddress = Wallet.wallet?.getActiveAccountKey()?.address
    if (mainAddress) {
      await dispatch(AssetActions.findAll({ owner: mainAddress }))
    }
  },

  transfer:
    (asset: Required<Asset>, owner: string, toAddress: string): AsyncAction =>
    async dispatch => {
      const { tokenAddress, tokenId, link, version } = asset
      dispatch(FetchingActions.start("Transferring item..."))
      try {
        const assetContract = await ERC721().at(tokenAddress)

        const callback = (err: any, hash: string) => {
          if (err) {
            Router.pushRoute(`${link}/transfer`)
          } else if (hash) {
            dispatch(
              ExchangeActions.startTransaction(hash, "Transferring your item"),
            )
            dispatch(AssetActions.find(tokenAddress, tokenId))
          }
        }
        if (version == TokenStandardVersion.ERC721v3) {
          assetContract.transferFrom(
            owner,
            toAddress,
            tokenId,
            { from: owner },
            callback,
          )
        } else {
          assetContract.transfer(toAddress, tokenId, { from: owner }, callback)
        }
      } catch (error) {
        dispatch(ErrorActions.show(error))
      } finally {
        dispatch(FetchingActions.stop())
      }
    },

  /**
   * Resets the asset and calls out to fetcher for a new one
   * @param addressOrCollection address or collection slug
   * @param tokenId id of token
   * @param req optional SSR Node.js request
   * @param res Server-side response: optional Node.js response
   */
  find:
    (
      addressOrCollection: string,
      tokenId: string,
      {
        req,
        res,
        forceUpdate = false,
        noReset = false,
      }: {
        req?: IncomingMessage
        res?: ServerResponse
        forceUpdate?: boolean
        noReset?: boolean
      } = {},
    ): AsyncAction<Asset> =>
    async (dispatch, getState) => {
      try {
        if (!noReset && !forceUpdate) {
          dispatch(AssetActions.reset())
        }
        dispatch(FetchingActions.start(`Loading asset data`))
        return await dispatch(
          AssetActions._load(addressOrCollection, tokenId, {
            request: req,
            forceUpdate,
          }),
        )
      } catch (error) {
        // Reset asset to avoid sending a stale one
        dispatch(AssetActions.reset())
        if (error.message.startsWith(API_MESSAGE_404)) {
          dispatch(ErrorActions.handleNotFound(res))
        } else {
          dispatch(
            ErrorActions.show(
              error,
              `There was an error trying to load this item. Try refreshing the page.`,
            ),
          )
        }
        return getState().asset
      } finally {
        dispatch(FetchingActions.stop())
      }
    },

  refresh:
    (asset: Asset, opts = { forceUpdate: true }): AsyncAction =>
    async dispatch => {
      if (asset.tokenAddress && asset.tokenId) {
        await dispatch(
          AssetActions.load(asset.tokenAddress, asset.tokenId, opts),
        )
      }
    },

  load:
    (
      tokenAddress: string,
      tokenId: string,
      opts: {
        request?: IncomingMessage
        forceUpdate?: boolean
      } = {},
    ): AsyncAction<Asset> =>
    async dispatch => {
      try {
        return await dispatch(AssetActions._load(tokenAddress, tokenId, opts))
      } catch (error) {
        dispatch(
          ErrorActions.show(
            error,
            `There was an error trying to load this item. Try refreshing!`,
          ),
        )
        throw error
      } finally {
        dispatch(FetchingActions.stop())
      }
    },

  reset() {
    return { type: ActionTypes.RESET_ASSET }
  },

  _filterAndFind:
    (filterParams: Filter, append = false): AsyncAction =>
    async (dispatch, getState) => {
      try {
        dispatch(AssetActions.filter(filterParams))
        const query = qs.stringify(getState().assets.filter)
        const assetRequest = "/assets/?" + query
        const data = await Transport.fetch(assetRequest)
        if (append) {
          dispatch(AssetActions.appendAll(data))
        } else {
          dispatch(AssetActions.receiveAll(data))
        }
      } catch (error) {
        dispatch(
          ErrorActions.show(
            error,
            `There was an error loading assets; check your network settings!`,
          ),
        )
      } finally {
        dispatch(FetchingActions.stop())
      }
    },

  _load:
    (
      tokenAddress: string,
      tokenId: string,
      {
        request,
        forceUpdate,
      }: {
        request?: IncomingMessage
        forceUpdate?: boolean
      },
    ): AsyncAction<Asset> =>
    async (dispatch, getState) => {
      const account_address = IS_SERVER ? undefined : getState().account.address
      const assetRequest = `/asset/${tokenAddress}/${tokenId}/`
      const query = { force_update: forceUpdate, account_address }
      const data = await Transport.fetch(
        `${assetRequest}?${qs.stringify(query)}`,
        { request },
      )
      dispatch(AssetActions.receive(data))
      return getState().asset
    },

  receive: (data: any): Action => ({ type: ActionTypes.RECEIVE_ASSET, data }),

  receiveOwnership: (data: any): Action => ({
    type: ActionTypes.RECEIVE_ASSET_OWNERSHIP,
    data,
  }),

  receiveAll: (data: any): Action => ({
    type: ActionTypes.RECEIVE_ASSET_LIST,
    data,
  }),

  appendAll: (data: any): Action => ({
    type: ActionTypes.APPEND_ASSET_LIST,
    data,
  }),

  filter: (filter: Filter): Action => ({
    type: ActionTypes.SET_ASSET_FILTER,
    filter,
  }),

  bootstrap: (asset: Asset): Action => ({
    type: ActionTypes.BOOTSTRAP_ASSET,
    asset,
  }),

  bootstrapV2: (data: Asset_data["asset"]): Action => ({
    type: ActionTypes.BOOTSTRAP_ASSETV2,
    data,
  }),

  updatePrice: (): Action => ({ type: ActionTypes.UPDATE_PRICE }),

  mint:
    ({
      address,
      onPrompt,
    }: {
      address: string
      onPrompt: () => unknown
    }): AsyncAction<string> =>
    async (dispatch, getState) => {
      const { account } = getState()
      if (!account.address) {
        throw new Error("Account not found.")
      }
      const contract = await OpenSeaAsset().at(address || "")
      const gasPrice = await getGasPrice()
      const txHash = await promisify2<string, Web3.TxData, string>(
        contract.mintTo,
      )(account.address, {
        from: account.address,
        gasPrice,
      })
      dispatch(ExchangeActions.startTransaction(txHash, "Minting your item"))
      if (onPrompt) {
        onPrompt()
      }
      const receipt = await confirmTransaction(txHash)
      if (!receipt) {
        throw new Error("Unable to create asset. Please refresh and try again!")
      }
      const tokenId = new Web3()
        .toBigNumber(receipt.logs[0].topics[3])
        .toFixed()
      return tokenId
    },

  update:
    (asset: Asset): AsyncAction =>
    async dispatch => {
      const { tokenAddress, tokenId, name, description, externalLink } = asset
      try {
        dispatch(FetchingActions.start("Updating..."))
        await Auth.UNSAFE_login()
        await Transport.sendJSON(`/asset/${tokenAddress}/${tokenId}/update/`, {
          body: {
            name,
            description,
            external_link: externalLink,
          },
        })
      } catch (error) {
        dispatch(
          ErrorActions.show(
            error,
            `Problem updating your item: ${error.message}`,
          ),
        )
        throw error
      }
    },

  uploadImage:
    ({
      asset,
      imageFile,
    }: {
      asset: Asset
      imageFile: File
    }): AsyncAction<{
      imageUrl: string
      imageUrlThumbnail: string
      imageUrlPreview: string
    }> =>
    async dispatch => {
      const { tokenAddress, tokenId } = asset
      try {
        dispatch(FetchingActions.start("Uploading image..."))
        await Auth.UNSAFE_login()
        const formData = new FormData()
        formData.append("image", imageFile)
        const { image_url, image_thumbnail_url, image_preview_url } =
          await Transport.sendForm(
            `/asset/${tokenAddress}/${tokenId}/image/upload/`,
            {
              method: "POST",
              body: formData,
            },
          )
        return {
          imageUrl: image_url,
          imageUrlThumbnail: image_thumbnail_url,
          imageUrlPreview: image_preview_url,
        }
      } catch (error) {
        dispatch(
          ErrorActions.show(
            error,
            `Problem updating your image: ${error.message}`,
          ),
        )
        throw error
      }
    },
}

export default AssetActions
