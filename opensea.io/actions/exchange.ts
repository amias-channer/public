import BigNumber from "bignumber.js"
import { EventType, OpenSeaPort, WyvernProtocol } from "opensea-js"
import {
  ENJIN_COIN_ADDRESS,
  MANA_ADDRESS,
  MAX_UINT_256,
} from "opensea-js/lib/constants"
import {
  OpenSeaAsset,
  Order,
  UnsignedOrder,
  WyvernNFTAsset,
} from "opensea-js/lib/types"
import ReactGA from "react-ga"
import { method, ERC20 } from "../abi/index"
import { NULL_ACCOUNT } from "../constants"
import {
  captureWarning,
  captureNoncriticalError,
} from "../lib/analytics/analytics"
import {
  ExternalAuctionEventName,
  trackApproveAll,
  trackApproveAsset,
  trackApproveBuyOrder,
  trackApproveCurrency,
  trackApproveSellOrder,
  trackCancelBuyOrder,
  trackCancelSellOrder,
  trackCreateSellOrder,
  trackExternalAuctionEvent,
  trackInitializeProxy,
  trackMatchOrdersBuying,
  trackMatchOrdersSelling,
  trackOpenNotEnoughBalanceModal,
  trackCreateTransaction,
  trackTransactionFailed,
  trackTransferAll,
  trackUnwrapWeth,
  trackWrapWeth,
} from "../lib/analytics/events/exchangeEvents"
import Auth from "../lib/auth"
import Ethereum from "../lib/chain/networks/ethereum"
import Web3EvmProvider from "../lib/chain/providers/web3EvmProvider"
import Wallet from "../lib/chain/wallet"
import { orderLink_data$key } from "../lib/graphql/__generated__/orderLink_data.graphql"
import { clearCache } from "../lib/graphql/environment/middlewares/cacheMiddleware"
import { addressToToken, addressesEqual } from "../lib/helpers/addresses"
import {
  bn,
  normalizePriceDisplay,
  ETH_DECIMALS,
} from "../lib/helpers/numberUtils"
import { readOrderLink } from "../lib/helpers/orderLink"
import { truncateText } from "../lib/helpers/stringUtils"
import { walletError } from "../lib/helpers/wallet"
import Network from "../lib/network"
import Transport from "../lib/transport"
import {
  OrderSide,
  confirmTransaction,
  encodeCall,
  makeBigNumber,
} from "../lib/wyvern"
import { Asset } from "../reducers/assets"
import {
  buildOrder,
  ExtendedOrder,
  Tradeable,
  EscrowAuction,
} from "../reducers/auctions"
import { Bundle } from "../reducers/bundles"
import { Category } from "../reducers/categories"
import { Token } from "../reducers/tokens"
import { App, AsyncAction, Action } from "../store"
import AssetActions from "./assets"
import BundleActions from "./bundles"
import ErrorActions from "./errors"
import FetchingActions from "./fetching"
import * as ActionTypes from "./index"
import ReferralActions from "./referrals"
import UserActions from "./users"

const onCheck = (ok: boolean, msg: string) => {
  ;(ok ? console.info : console.warn)(msg)
}
const onTxHash = (txHash: string) => {
  console.info(Ethereum.getTransactionUrl(txHash))
}

const ExchangeActions = {
  // Throws if no web3 access
  handleSeaportEvents: (seaport: OpenSeaPort): AsyncAction => {
    const approvalEvents = [
      EventType.ApproveAllAssets,
      EventType.ApproveAsset,
      EventType.ApproveCurrency,
    ]

    return async dispatch => {
      seaport.addListener(
        EventType.TransactionCreated,
        ({ transactionHash, event }) => {
          console.info({ transactionHash, event })
          dispatch(ExchangeActions.startTransaction(transactionHash as string))
          trackCreateTransaction({
            transactionHash,
          })
        },
      )
      seaport.addListener(
        EventType.TransactionConfirmed,
        ({ transactionHash, event }) => {
          console.info({ transactionHash, event })
          if (!approvalEvents.includes(event as EventType)) {
            dispatch(ExchangeActions.reset())
          }
        },
      )
      seaport.addListener(
        EventType.TransactionFailed,
        ({ transactionHash, event }) => {
          console.info({ transactionHash, event })
          dispatch(ExchangeActions.reset())

          trackTransactionFailed({
            transactionHash,
          })
        },
      )
      seaport.addListener(EventType.InitializeAccount, ({ accountAddress }) => {
        console.info({ accountAddress })
        dispatch({ type: ActionTypes.INITIALIZE_PROXY })

        trackInitializeProxy()
      })
      seaport.addListener(EventType.WrapEth, ({ accountAddress, amount }) => {
        console.info({ accountAddress, amount })
        dispatch({ type: ActionTypes.WRAP_ETH })

        trackWrapWeth({
          amount: amount?.toNumber(),
        })
      })
      seaport.addListener(
        EventType.UnwrapWeth,
        ({ accountAddress, amount }) => {
          console.info({ accountAddress, amount })
          dispatch({ type: ActionTypes.UNWRAP_WETH })

          trackUnwrapWeth({
            amount: amount?.toNumber(),
          })
        },
      )
      seaport.addListener(
        EventType.ApproveCurrency,
        async ({ accountAddress, contractAddress }) => {
          console.info({ accountAddress, contractAddress })
          if (!contractAddress) {
            captureWarning(new Error("No contract address being approved"))
            return
          }
          const token = addressToToken(contractAddress as string)
          const label = token ? token.symbol : truncateText(contractAddress, 6)
          const transactionNotice = `Approve your ${label} for trading`
          dispatch({ type: ActionTypes.APPROVE_CURRENCY, transactionNotice })

          trackApproveCurrency({
            paymentTokenAddress: contractAddress,
          })
        },
      )
      seaport.addListener(
        EventType.ApproveAllAssets,
        ({ proxyAddress, contractAddress }) => {
          const transactionNotice = `Unlock all tokens of this type for trading!`
          dispatch({ type: ActionTypes.APPROVE_ALL_ASSETS, transactionNotice })

          trackApproveAll({
            tokenAddress: contractAddress,
            proxyAddress,
          })
        },
      )
      seaport.addListener(EventType.ApproveAsset, ({ proxyAddress, asset }) => {
        const tokenAddress = (asset as WyvernNFTAsset).address
        const tokenId = (asset as WyvernNFTAsset).id
        const transactionNotice = `Unlock token #${tokenId} for trading!`
        dispatch({ type: ActionTypes.APPROVE_ASSET, transactionNotice })

        trackApproveAsset({
          tokenAddress,
          proxyAddress,
          tokenId,
        })
      })
      seaport.addListener(
        EventType.ApproveOrder,
        ({ order, accountAddress }) => {
          console.info({ order, accountAddress })
          order = order as Order | UnsignedOrder
          const transactionNotice = `Approving ${
            order.side == 1 ? "your listing" : "your offer"
          }...`
          dispatch({ type: ActionTypes.CREATE_ORDER, transactionNotice })

          if (order.side === OrderSide.Sell) {
            trackApproveSellOrder()
          } else {
            trackApproveBuyOrder()
          }
        },
      )
      seaport.addListener(
        EventType.CreateOrder,
        ({ order, accountAddress }) => {
          console.info({ order, accountAddress })
          order = order as Order | UnsignedOrder
          const transactionNotice = `${
            order.side == 1
              ? `Listing your ${"bundle" in order.metadata ? "bundle" : "item"}`
              : `Submitting your offer`
          }...`
          dispatch({ type: ActionTypes.CREATE_ORDER, transactionNotice })

          if (order.side === OrderSide.Sell) {
            trackCreateSellOrder()
          } else {
            trackCancelBuyOrder()
          }
        },
      )
      seaport.addListener(
        EventType.CancelOrder,
        ({ order, accountAddress }) => {
          console.info({ order, accountAddress })
          order = order as Order
          const transactionNotice = `Cancelling ${
            order.side == 1 ? "sell" : "buy"
          } order`
          dispatch({ type: ActionTypes.CANCEL_ORDER, transactionNotice })

          if (order.side === OrderSide.Sell) {
            trackCancelSellOrder()
          } else {
            trackCancelBuyOrder()
          }
        },
      )
      seaport.addListener(
        EventType.TransferAll,
        ({ accountAddress, toAddress, assets }) => {
          console.info({ accountAddress, toAddress, assets })
          assets = assets as WyvernNFTAsset[]
          const transactionNotice = `Transferring ${assets.length} item${
            assets.length == 1 ? "" : "s"
          }`
          dispatch({ type: ActionTypes.CREATE_TRANSACTION, transactionNotice })

          trackTransferAll({
            toAddress,
          })
        },
      )
      seaport.addListener(
        EventType.MatchOrders,
        ({ buy, sell, accountAddress }) => {
          console.info({ buy, sell, accountAddress })
          buy = buy as Order
          sell = sell as Order
          const token = addressToToken(buy.paymentToken)
          const tokenSymbol = token && token.symbol
          // TODO: confusing!
          // Despite the API and SDK using base units for currentPrice,
          // we format orders as units in buildOrder
          const unitAmount = sell.currentPrice
            ? makeBigNumber(sell.currentPrice).times(sell.quantity)
            : makeBigNumber(buy.currentPrice || 0).times(buy.quantity)

          let transactionNotice
          const isBuying = addressesEqual(accountAddress, buy.maker)
          if (!tokenSymbol) {
            transactionNotice = `Warning: unknown payment token. To proceed and purchase this item for ${normalizePriceDisplay(
              unitAmount,
            )}, complete this final transaction!`
          } else if (isBuying) {
            transactionNotice = `To purchase this item for ${normalizePriceDisplay(
              unitAmount,
            )} ${tokenSymbol}, complete this final transaction!`
          } else {
            transactionNotice = `To accept this offer and receive payment in exchange for this item, complete this final transaction!`
          }

          if (isBuying) {
            trackMatchOrdersBuying({
              tokenSymbol,
              unitAmount: unitAmount.toNumber(),
              metadata: sell.metadata,
            })
          } else {
            trackMatchOrdersSelling({
              tokenSymbol,
              unitAmount: unitAmount.toNumber(),
              metadata: sell.metadata,
            })
          }
          dispatch({
            type: ActionTypes.CREATE_TRANSACTION,
            transactionNotice,
            isBuying,
          })
          dispatch({
            type: ActionTypes.FULFILL_ORDER,
            transactionNotice,
          })
        },
      )
      seaport.addListener(
        EventType.CancelOrder,
        ({ order, accountAddress }) => {
          console.info({ order, accountAddress })
        },
      )
    }
  },

  reset: (): Action => ({ type: ActionTypes.RESET_EXCHANGE }),

  wrapEth:
    (amountInEth: number): AsyncAction =>
    async (dispatch, getState) => {
      try {
        dispatch(FetchingActions.start("Wrapping ETH..."))
        dispatch({ type: ActionTypes.WRAP_ETH })
        trackWrapWeth({
          amount: amountInEth,
        })

        const accountAddress = getState().account.address
        const seaport = await Network.seaport()
        if (!accountAddress || !seaport) {
          throw walletError
        }

        const balance = await ExchangeActions._getBalance(accountAddress)
        if (balance === undefined) {
          throw walletError
        }
        if (!balance.greaterThanOrEqualTo(amountInEth.toString())) {
          trackOpenNotEnoughBalanceModal({
            source: "wrap-eth",
            amountInEth,
          })
          dispatch({
            type: ActionTypes.FULFILL_ORDER,
            addressOfMissingToken: NULL_ACCOUNT,
            transactionValue: amountInEth,
          })
          return
        }

        await seaport.wrapEth({
          amountInEth,
          accountAddress,
        })
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        const { exchange } = getState()
        // Don't close modal if we're out of $
        if (!exchange.addressOfMissingToken) {
          dispatch(ExchangeActions.reset())
        }
        dispatch(FetchingActions.stop())
      }
    },

  unwrapWeth: (amountInEth: number): AsyncAction => {
    return async (dispatch, getState) => {
      try {
        dispatch(FetchingActions.start("Unwrapping W-ETH..."))
        const accountAddress = getState().account.address
        const seaport = await Network.seaport()
        if (!accountAddress || !seaport) {
          throw walletError
        }

        await seaport.unwrapWeth({
          amountInEth,
          accountAddress,
        })
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  legacyFulfillOrderV2: (
    order: orderLink_data$key & { oldOrder: string | null },
  ): AsyncAction => {
    return async dispatch => {
      if (order.oldOrder) {
        const orderJSON = JSON.parse(order.oldOrder)
        if (orderJSON.order_hash) {
          // some old order json has blank attrs
          return dispatch(ExchangeActions.fulfillOrder(buildOrder(orderJSON)))
        }
      }

      return ExchangeActions._openOrderV2Link(order, "fulfill external auction")
    }
  },

  cancelOrderV2: (
    order: orderLink_data$key & { oldOrder: string | null },
  ): AsyncAction => {
    return async dispatch => {
      if (order.oldOrder) {
        const orderJSON = JSON.parse(order.oldOrder)
        if (orderJSON.order_hash) {
          // some old order json has blank attrs
          return dispatch(
            ExchangeActions.cancelOrder(buildOrder(JSON.parse(order.oldOrder))),
          )
        }
      }

      return ExchangeActions._openOrderV2Link(order, "cancel external auction")
    }
  },

  placeBuyOrder: ({
    asset,
    amount,
    quantity = 1,
    expirationTime = 0,
    paymentTokenAddress,
    currentSellOrder,
  }: {
    asset: Required<Asset> | OpenSeaAsset
    amount: number
    quantity?: number
    expirationTime?: number
    paymentTokenAddress?: string
    currentSellOrder?: Order
  }): AsyncAction<Order | undefined> => {
    return async (dispatch, getState) => {
      try {
        dispatch(FetchingActions.start("Making bid..."))
        dispatch({ type: ActionTypes.CREATE_ORDER })
        const accountAddress = getState().account.address
        const seaport = await Network.seaport()
        const provider = await Wallet.wallet?.getProviderOrRedirect()
        if (!accountAddress || !seaport || !provider) {
          return undefined
        }

        const { referrerAddress } = await dispatch(
          ReferralActions.getLastReferral(),
        )

        // Don't send a sell order if not English auction
        const sellOrder =
          currentSellOrder && currentSellOrder.waitingForBestCounterOrder
            ? currentSellOrder
            : undefined

        const order = await seaport.createBuyOrder({
          asset,
          accountAddress,
          startAmount: amount,
          quantity,
          expirationTime,
          paymentTokenAddress,
          sellOrder,
          referrerAddress,
        })
        dispatch(ErrorActions.reset())
        clearCache()
        return order
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  placeBundleBuyOrder: ({
    bundle,
    amount,
    expirationTime = 0,
    paymentTokenAddress,
    currentSellOrder,
  }: {
    bundle: Bundle
    amount: number
    expirationTime?: number
    paymentTokenAddress?: string
    currentSellOrder?: Order
  }): AsyncAction<Order | undefined> => {
    return async (dispatch, getState) => {
      try {
        dispatch(FetchingActions.start("Making bid..."))
        dispatch({ type: ActionTypes.CREATE_ORDER })
        const accountAddress = getState().account.address
        const seaport = await Network.seaport()
        const provider = await Wallet.wallet?.getProviderOrRedirect()
        if (!accountAddress || !seaport || !provider) {
          return undefined
        }

        // Don't send a sell order if not English auction
        const sellOrder =
          currentSellOrder && currentSellOrder.waitingForBestCounterOrder
            ? currentSellOrder
            : undefined

        if (bundle.assets) {
          const order = await seaport.createBundleBuyOrder({
            assets: bundle.assets,
            collection: bundle.collection as Required<Category>,
            accountAddress,
            startAmount: amount,
            expirationTime,
            paymentTokenAddress,
            sellOrder,
          })
          clearCache()
          return order
        } else {
          throw Error("Missing assets")
        }
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  checkFulfillable: (
    order: ExtendedOrder,
    accountAddress: string,
  ): AsyncAction<boolean> => {
    return async dispatch => {
      try {
        const seaport = await Network.seaport()
        if (!seaport) {
          throw walletError
        }
        return await seaport.isOrderFulfillable({
          order,
          accountAddress,
        })
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      }
    }
  },

  reportNotEnoughBalance:
    ({
      order,
      auction,
    }: {
      order?: ExtendedOrder
      auction?: EscrowAuction
    }): AsyncAction<void> =>
    async dispatch => {
      const missingToken =
        order?.paymentTokenContract || auction?.paymentTokenContract
      const transactionValue = order?.currentTotalPrice || auction?.currentPrice
      if (!missingToken || !transactionValue) {
        captureWarning(
          new Error(`No token/value found for ${order} or ${auction}`),
        )
        return
      }

      trackOpenNotEnoughBalanceModal({
        missingToken,
        transactionValue: transactionValue.toNumber(),
      })

      dispatch({
        type: ActionTypes.FULFILL_ORDER,
        addressOfMissingToken: missingToken.address,
        transactionValue,
      })
    },

  checkEnoughBalance:
    ({
      order,
      auction,
    }: {
      order?: ExtendedOrder
      auction?: EscrowAuction
    }): AsyncAction<boolean> =>
    async (dispatch, getState) => {
      const takerAddress = getState().account.address
      if (auction || order?.side === OrderSide.Sell) {
        try {
          dispatch(FetchingActions.start("Checking balance..."))

          const token =
            order?.paymentTokenContract || auction?.paymentTokenContract

          const requiredAmount = order?.currentTotalPrice
            ? makeBigNumber(order.currentTotalPrice)
            : auction?.currentPrice
            ? makeBigNumber(auction.currentPrice)
            : undefined

          if (!token || !requiredAmount) {
            throw new Error(
              "Payment token from either an order or auction is required",
            )
          }

          if (!takerAddress) {
            throw walletError
          }
          const balance = await ExchangeActions._getBalance(takerAddress, token)
          if (balance === undefined) {
            throw walletError
          }
          return balance.greaterThanOrEqualTo(requiredAmount)
        } finally {
          dispatch(FetchingActions.stop())
        }
      } else {
        // Rely on SDK to do asset ownership checks for buy orders
        return true
      }
    },

  checkTransferrable(
    asset: Required<Asset>,
    accountAddress: string,
    useProxy = true,
    quantity?: BigNumber,
  ) {
    return async (dispatch: any, getState: () => App) => {
      try {
        if (asset.assetContract.onlyProxiedTransfers) {
          return true
        }
        const seaport = await Network.seaport()
        if (!seaport) {
          throw walletError
        }
        const currentAddress = getState().account.address
        const fromAddress =
          asset.owner === NULL_ACCOUNT && !asset.isNonFungible && currentAddress
            ? // Haven't loaded asset ownership yet
              currentAddress
            : asset.owner
        return await seaport.isAssetTransferrable({
          asset,
          fromAddress,
          toAddress: accountAddress,
          quantity,
          useProxy,
        })
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      }
    }
  },

  async _requireVerifiedEmail(assetOrBundle: Asset | Bundle, dispatch: any) {
    if (
      assetOrBundle.assetContract &&
      assetOrBundle.assetContract.requireEmail
    ) {
      dispatch({ type: ActionTypes.AUTHORIZE_ORDER })
      const emailSetAndVerified = await dispatch(
        UserActions.enterEmailIfNeeded(),
      )
      return emailSetAndVerified
    }
    return true
  },

  buyWithFiat() {
    return async (dispatch: any) => {
      try {
        dispatch(FetchingActions.start("Buying item..."))
        throw new Error("USD purchases are disabled in your region")
      } catch (error) {
        dispatch(ExchangeActions.reset())
        dispatch(ErrorActions.show(error))
      } finally {
        // dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  fulfillOrder: (order: ExtendedOrder): AsyncAction => {
    return async (dispatch, getState) => {
      try {
        dispatch(FetchingActions.start("Authenticating order..."))
        const { asset, bundle, account } = getState()
        const accountAddress = account.address
        const seaport = await Network.seaport()
        const provider = await Wallet.wallet?.getProviderOrRedirect()
        if (!accountAddress || !seaport || !provider) {
          return
        }

        const assetOrBundle: Tradeable =
          order.assetOrBundle || (asset.tokenId ? asset : bundle)

        const isTradeable = await ExchangeActions.pretradeChecks(
          order,
          assetOrBundle,
          dispatch,
        )

        if (isTradeable) {
          // Order needs to be refetched
          order = await ExchangeActions._getAuthedOrder(order, dispatch)

          dispatch(FetchingActions.start("Fulfilling order..."))
          // To show user something while sdk verifies:
          dispatch({ type: ActionTypes.AUTHORIZE_ORDER })

          const { referrerAddress } = await dispatch(
            ReferralActions.getLastReferral(),
          )

          if (asset.transferFeeToken && order.side === OrderSide.Buy) {
            await ExchangeActions._requireTransferFeeTokenBalance(
              accountAddress,
              asset as Required<Asset>,
              dispatch,
            )
          }

          await seaport.fulfillOrder({
            order,
            accountAddress,
            referrerAddress,
          })

          if (referrerAddress) {
            dispatch(ReferralActions.reset())
          }
          await dispatch(AssetActions.refresh(asset))
          await dispatch(BundleActions.refresh(bundle))
          clearCache()
        }
      } catch (error) {
        const { exchange } = getState()
        // Don't show error if we're out of $
        if (!exchange.addressOfMissingToken) {
          dispatch(ErrorActions.show(error))
        }
      } finally {
        dispatch(FetchingActions.stop())
        const { exchange } = getState()
        // Don't close modal if we're out of $
        if (!exchange.addressOfMissingToken) {
          dispatch(ExchangeActions.reset())
        }
      }
    }
  },

  /**
   * Transfer a token or item
   * @param asset asset to transfer
   * @param toAddress address to receive
   * @param quantity Quantity, in units, to send
   */
  transferAsset(asset: Required<Asset>, toAddress: string, quantity?: number) {
    return async (dispatch: any) => {
      try {
        dispatch(FetchingActions.start("Transferring asset..."))
        const accountAddress = Wallet.wallet?.getActiveAccountKey()?.address
        const seaport = await Network.seaport()
        if (!accountAddress || !seaport) {
          throw walletError
        }

        if (!asset.tokenAddress || !asset.assetContract) {
          throw new Error(
            "This asset is not transferrable (no smart contract address found)",
          )
        }

        if (asset.transferFeeToken) {
          await ExchangeActions._requireTransferFeeTokenBalance(
            accountAddress,
            asset,
            dispatch,
          )
        }

        // Backwards compat with old assetTransfer logic
        dispatch(FetchingActions.stop())

        await seaport.transfer({
          asset,
          fromAddress: accountAddress,
          toAddress,
          quantity,
        })

        await dispatch(AssetActions.refresh(asset))
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  transferAll(assets: Array<Required<Asset>>, toAddress: string) {
    return async (dispatch: any, getState: any) => {
      try {
        dispatch(FetchingActions.start("Making bulk transfer..."))
        dispatch({
          type: ActionTypes.CREATE_TRANSACTION,
          transactionNotice: "Checking approval status for all items...",
        })
        const accountAddress = getState().account.address
        const seaport = await Network.seaport()
        if (!accountAddress || !seaport) {
          throw walletError
        }

        await seaport.transferAll({
          assets,
          fromAddress: accountAddress,
          toAddress,
        })
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  placeBundleSellOrder({
    assets,
    bundleDescription,
    bundleExternalLink,
    bundleName,
    buyerAddress,
    collection,
    endAmount,
    expirationTime = 0,
    extraBountyBasisPoints = 0,
    paymentTokenAddress,
    reservePrice = undefined,
    startAmount,
    waitForHighestBid = false,
    listingTime,
  }: {
    assets: Array<Required<Asset>>
    bundleDescription: string
    bundleExternalLink: string
    bundleName: string
    buyerAddress?: string
    collection?: Required<Category>
    endAmount: number
    expirationTime?: number
    extraBountyBasisPoints?: number
    paymentTokenAddress?: string
    reservePrice?: number
    startAmount: number
    waitForHighestBid?: boolean
    listingTime?: number
  }) {
    return async (dispatch: any, getState: () => App) => {
      try {
        dispatch(FetchingActions.start("Making bundle..."))
        dispatch({ type: ActionTypes.CREATE_ORDER })
        const accountAddress = getState().account.address
        const seaport = await Network.seaport()
        const provider = await Wallet.wallet?.getProviderOrRedirect()
        if (!accountAddress || !seaport || !provider) {
          return undefined
        }

        const bundle = await seaport.createBundleSellOrder({
          accountAddress,
          assets,
          bundleDescription,
          bundleExternalLink,
          bundleName,
          buyerAddress,
          collection,
          endAmount,
          expirationTime,
          extraBountyBasisPoints,
          paymentTokenAddress,
          englishAuctionReservePrice: reservePrice,
          startAmount,
          waitForHighestBid,
          listingTime,
        })
        clearCache()
        return bundle
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  placeSellOrder({
    asset,
    buyerAddress,
    buyerEmail,
    endAmount,
    expirationTime = 0,
    extraBountyBasisPoints = 0,
    paymentTokenAddress,
    quantity = 1,
    reservePrice = undefined,
    startAmount,
    waitForHighestBid = false,
    listingTime,
  }: {
    asset: Required<Asset> | OpenSeaAsset
    buyerAddress?: string
    buyerEmail?: string
    endAmount?: number
    expirationTime?: number
    extraBountyBasisPoints?: number
    paymentTokenAddress?: string
    quantity?: number
    reservePrice?: number
    startAmount: number
    waitForHighestBid?: boolean
    listingTime?: number
  }) {
    return async (dispatch: any, getState: () => App) => {
      try {
        dispatch(FetchingActions.start("Making auction..."))
        const { account } = getState()
        const accountAddress = account.address
        const seaport = await Network.seaport()
        const provider = await Wallet.wallet?.getProviderOrRedirect()
        if (!accountAddress || !seaport || !provider) {
          return undefined
        }
        dispatch({ type: ActionTypes.CREATE_ORDER })

        if ("transferFeeToken" in asset && asset.transferFeeToken) {
          await ExchangeActions._requireTransferFeeTokenBalance(
            accountAddress,
            asset,
            dispatch,
          )
        }

        const order = await seaport.createSellOrder({
          accountAddress,
          asset: {
            ...asset,
            schemaName: asset.schemaName || asset.assetContract.schemaName,
          },
          buyerAddress,
          buyerEmail,
          endAmount,
          expirationTime,
          extraBountyBasisPoints,
          paymentTokenAddress,
          quantity,
          englishAuctionReservePrice: reservePrice,
          startAmount,
          waitForHighestBid,
          listingTime,
        })
        dispatch(ErrorActions.reset())
        clearCache()
        return order
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  cancelOrder(order: ExtendedOrder) {
    return async (dispatch: any, getState: any) => {
      try {
        dispatch(FetchingActions.start("Cancelling order..."))
        const accountAddress = getState().account.address
        const seaport = await Network.seaport()
        const provider = await Wallet.wallet?.getProviderOrRedirect()
        if (!accountAddress || !seaport || !provider) {
          return
        }
        // Order needs to be authed
        order = await ExchangeActions._getAuthedOrder(order, dispatch)
        await seaport.cancelOrder({
          order,
          accountAddress,
        })
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(ExchangeActions.reset())
        dispatch(FetchingActions.stop())
      }
    }
  },

  depositAsset(asset: Required<Asset>) {
    return async (dispatch: any, getState: () => App) => {
      try {
        dispatch(FetchingActions.start("Depositing asset..."))
        const { proxy, address } = getState().account
        const seaport = await Network.seaport()
        if (!address || !seaport) {
          throw walletError
        }
        let proxyAddress = proxy
        if (!proxy) {
          console.warn("No proxy for this account. Initializing...")
          proxyAddress = await ExchangeActions._initializeProxy(address)
        }
        if (!proxyAddress) {
          return
        }

        await seaport.transfer({
          asset,
          fromAddress: address,
          toAddress: proxyAddress,
        })
      } catch (error) {
        dispatch(ErrorActions.show(error))
        throw error
      } finally {
        dispatch(FetchingActions.stop())
      }
    }
  },

  // Returns whether the asset or bundle should be tradeable
  async pretradeChecks(
    order: ExtendedOrder,
    assetOrBundle: Tradeable,
    dispatch: any,
  ): Promise<boolean> {
    const { assetContract, primarySellOrder, collection } = assetOrBundle
    if (assetContract && !assetContract.settlementEnabled) {
      dispatch(
        ErrorActions.show(
          new Error(
            `This asset is temporarily locked for trading by the contract creator. Contact ${
              collection ? collection.name : "the developer"
            }${
              collection?.externalLink
                ? " (" + collection.externalLink + ")"
                : ""
            } for more info.`,
          ),
        ),
      )
      return false
    }

    const isEthWethPair =
      order.paymentTokenContract.symbol === "WETH" &&
      primarySellOrder?.paymentTokenContract.symbol === "ETH"
    if (
      order.side === OrderSide.Buy &&
      primarySellOrder &&
      !isEthWethPair &&
      order.paymentTokenContract.symbol !==
        primarySellOrder.paymentTokenContract.symbol
    ) {
      const didAgree = confirm(
        `This offer is in ${order.paymentTokenContract.symbol} (${order.paymentTokenContract.name}). Are you sure you want to continue?`,
      )
      if (!didAgree) {
        return false
      }
    }

    const isEnough = await dispatch(
      ExchangeActions.checkEnoughBalance({ order }),
    )
    if (!isEnough) {
      await dispatch(ExchangeActions.reportNotEnoughBalance({ order }))
      return false
    }

    return ExchangeActions._requireVerifiedEmail(assetOrBundle, dispatch)
  },

  _openOrderV2Link(
    order: orderLink_data$key,
    eventName: ExternalAuctionEventName,
    target = "_blank",
  ) {
    const url = readOrderLink(order)
    if (!url) {
      captureNoncriticalError(
        new Error(`No link found for order during ${eventName}`),
      )
      return
    }
    ReactGA.outboundLink({ label: url }, () => {
      trackExternalAuctionEvent(eventName, {
        url,
        target,
      })
    })
    window.open(url, target)
  },

  /**
   * Check an account's balance of a given token or ETH
   * @param accountAddress Address to check balance for
   * @param token Defaults to ETH. Token to check
   */
  async _getBalance(
    accountAddress: string,
    token?: Token,
  ): Promise<BigNumber | undefined> {
    const seaport = await Network.seaport()
    const provider = await Wallet.wallet?.getProviderOrRedirect()
    if (!seaport || !provider || !(provider instanceof Web3EvmProvider)) {
      // TODO: Remove or support all providers
      return undefined
    }

    if (!token || token.address == NULL_ACCOUNT) {
      const balance = await provider.getBalance(accountAddress)
      if (balance == null) {
        // TODO diagnose this error (might be with MM)
        // throw new Error("Couldn't retrieve your account balance. Make sure you have a wallet like MetaMask connected.")
        return bn(0)
      }
      return bn(balance, ETH_DECIMALS)
    } else {
      const balance = await seaport.getTokenBalance({
        accountAddress,
        tokenAddress: token.address,
      })
      return bn(balance, token.decimals)
    }
  },

  async _requireTransferFeeTokenBalance(
    accountAddress: string,
    asset: Required<Asset>,
    dispatch: any,
  ): Promise<void> {
    // Need to approve a transfer fee token, like for Enjin
    const fungibleTokenAddress = asset.transferFeeToken.address
    const seaport = await Network.seaport()
    if (!seaport) {
      throw walletError
    }

    const balance = await seaport.getTokenBalance({
      accountAddress,
      tokenAddress: fungibleTokenAddress,
    })
    const unitBalance = bn(balance, asset.transferFeeToken.decimals)
    if (unitBalance.lessThan(asset.transferFee)) {
      throw new Error(
        `This item has a transfer fee that goes to the creator. You need at least ${asset.transferFee} ${asset.transferFeeToken.symbol} to transfer it.`,
      )
    }

    await ExchangeActions.approveFungibleToken({
      account: accountAddress,
      tokenAddress: fungibleTokenAddress,
      requiredAmount: asset.transferFee,
      contractAddress: asset.tokenAddress,
      dispatch,
    })
  },

  async _getAuthedOrder(order: ExtendedOrder, dispatch: any) {
    if (order.isApproved) {
      // Already authed
      return order
    }
    const errorMessage = `You are not authorized for this order. Make sure your email is verified and correct for this dapp.`
    try {
      dispatch(FetchingActions.start("Fetching order signature"))
      dispatch({ type: ActionTypes.AUTHORIZE_ORDER })
      await Auth.UNSAFE_login()
      const path = `/order/${order.hash}/`
      const json = await Transport.fetch(path)
      const result = buildOrder(json)
      if (!result.s) {
        throw new Error(errorMessage)
      }
      return result
    } finally {
      dispatch(FetchingActions.stop())
    }
  },

  async _initializeProxy(accountAddress: string) {
    const seaport = await Network.seaport()
    if (!seaport) {
      throw walletError
    }
    const proxyAddress = await seaport._initializeProxy(accountAddress)
    return proxyAddress
  },

  async _getProxy(accountAddress: string) {
    const seaport = await Network.seaport()
    if (!seaport) {
      throw walletError
    }
    const proxyAddress = await seaport._getProxy(accountAddress)
    return proxyAddress
  },

  async getApprovedTokenCount(
    account: string,
    tokenAddress: string,
    _contractAddress?: string,
  ) {
    const networkName = await Network.getNetworkName()
    const contractAddress =
      _contractAddress ||
      WyvernProtocol.getTokenTransferProxyAddress(networkName)
    const { provider } =
      await Wallet.UNSAFE_get().UNSAFE_getActiveAccountAndProviderOrRedirect()
    if (!(provider instanceof Web3EvmProvider)) {
      // TODO: Remove or support all providers
      throw new Error("Unsupported wallet provider")
    }
    const count = await provider.call({
      source: account,
      destination: tokenAddress,
      data: encodeCall(method(ERC20, "allowance"), [account, contractAddress]),
    })
    return makeBigNumber(count)
  },

  // Returns txHash if sig approved
  // Can't use seaport's approveFungibleToken because of external _contractAddress param
  async approveFungibleToken({
    account,
    tokenAddress,
    requiredAmount,
    contractAddress,
    dispatch,
  }: {
    account: string
    tokenAddress: string
    requiredAmount?: BigNumber
    contractAddress?: string
    dispatch: any
  }) {
    const required = makeBigNumber(requiredAmount || MAX_UINT_256)
    const approved = await ExchangeActions.getApprovedTokenCount(
      account,
      tokenAddress,
      contractAddress,
    )
    if (approved.greaterThanOrEqualTo(required)) {
      onCheck(true, "Already approved enough token for trading")
      return null
    } else if (
      +approved > 0 &&
      (addressesEqual(tokenAddress, ENJIN_COIN_ADDRESS) ||
        addressesEqual(tokenAddress, MANA_ADDRESS))
    ) {
      // Older erc20s requires initial approval to be 0
      await ExchangeActions._transactAsync(
        {
          from: account,
          to: tokenAddress,
          data: encodeCall(method(ERC20, "approve"), [contractAddress, 0]),
          message: "First, clear your previous approval for this currency",
        },
        dispatch,
      )
    }

    const transactionNotice = `Approve your currency for trading`
    dispatch({ type: ActionTypes.APPROVE_CURRENCY, transactionNotice })
    const txHash = await ExchangeActions._transactAsync(
      {
        from: account,
        to: tokenAddress,
        data: encodeCall(method(ERC20, "approve"), [
          contractAddress,
          MAX_UINT_256.toString(),
        ]),
        message: "Approving trading for this currency",
      },
      dispatch,
    )
    return txHash
  },

  // Throws if txn fails
  // Returns txHash only on success
  async _transactAsync({ from, to, data, value, message }: any, dispatch: any) {
    const { provider } =
      await Wallet.UNSAFE_get().UNSAFE_getActiveAccountAndProviderOrRedirect()
    let txHash
    try {
      txHash = await provider.transact({
        source: from,
        destination: to,
        value,
        data,
      })
    } catch (error) {
      // User declined txn, don't throw
      dispatch(ExchangeActions.reset())
      dispatch(
        ErrorActions.show(error, `You declined the transaction: ${message}`),
      )
      throw error
    }

    onCheck(true, message)
    dispatch(ExchangeActions.startTransaction(txHash, message))
    await confirmTransaction(txHash)
    dispatch(ExchangeActions.reset())
    return txHash
  },

  startTransaction(hash: string, transactionNotice?: string) {
    onTxHash(hash)
    return {
      type: ActionTypes.SET_PENDING_TRANSACTION,
      hash,
      transactionNotice,
    }
  },
}

export default ExchangeActions
