import { FragmentRef } from "react-relay"
import { ChainIdentifier } from "../../constants"
import { trader_meta_transaction } from "../graphql/__generated__/trader_meta_transaction.graphql"
import { trader_sign_and_post } from "../graphql/__generated__/trader_sign_and_post.graphql"
import { trader_transaction } from "../graphql/__generated__/trader_transaction.graphql"
import { traderBridgingEventsQuery } from "../graphql/__generated__/traderBridgingEventsQuery.graphql"
import {
  traderCancelOrderMutation,
  traderCancelOrderMutationResponse,
} from "../graphql/__generated__/traderCancelOrderMutation.graphql"
import {
  traderCreateOrderMutation,
  traderCreateOrderMutationResponse,
} from "../graphql/__generated__/traderCreateOrderMutation.graphql"
import {
  traderOrderFulfillmentActionsQuery,
  traderOrderFulfillmentActionsQueryResponse,
} from "../graphql/__generated__/traderOrderFulfillmentActionsQuery.graphql"
import {
  traderRelayMetaTransactionMutation,
  traderRelayMetaTransactionMutationResponse,
} from "../graphql/__generated__/traderRelayMetaTransactionMutation.graphql"
import { traderTransactionQuery } from "../graphql/__generated__/traderTransactionQuery.graphql"
import { FetchConfig } from "../graphql/environment"
import { clearCache } from "../graphql/environment/middlewares/cacheMiddleware"
import { fetch, graphql, mutateGlobal } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"
import { bn } from "../helpers/numberUtils"
import { poll } from "../helpers/promise"
import { Transaction } from "./provider"
import Wallet from "./wallet"

export type Action = NonNullable<
  traderOrderFulfillmentActionsQueryResponse["order"]
>["fulfillmentActions"]["actions"][number]

export type ActionTransaction = NonNullable<
  traderCreateOrderMutationResponse["orders"]["create"]
>["transaction"]

const POLL_DELAY = 1000 * 2
const BRIDGING_POLL_DELAY = 1000 * 60
const MAX_POLL_TRANSACTION_ATTEMPTS = 30

const Trader = {
  fulfill: async ({ actionType, transaction }: Action): Promise<string> => {
    if (actionType !== "FULFILL") {
      throw new Error(
        `Unexpected fulfillment action type. Expected: FULFILL; Got: ${actionType}`,
      )
    }
    if (!transaction) {
      throw new Error("Fulfillment action has no transaction")
    }
    const transactionObject = readTransaction(transaction)
    //TODO: refactor. Rinkeby 0x contract address
    transactionObject.multiplyValueByGasPrice =
      transactionObject.destination ===
      "0xf8becacec90bfc361c0a2c720839e08405a72f6d"

    return Wallet.UNSAFE_get().transact(transactionObject)
  },

  approve: async ({ actionType, transaction }: Action): Promise<string> => {
    if (
      actionType !== "ASSET_APPROVAL" &&
      actionType !== "PAYMENT_ASSET_APPROVAL"
    ) {
      throw new Error(
        `Unexpected approval action type. Expected: ASSET_APPROVAL or PAYMENT_ASSET_APPROVAL; Got: ${actionType}`,
      )
    }
    if (!transaction) {
      throw new Error("Approval action has no transaction")
    }
    return Wallet.UNSAFE_get().transact(readTransaction(transaction))
  },

  relayMetaTransaction: async ({
    data,
  }: {
    data: FragmentRef<trader_meta_transaction>
  }): Promise<traderRelayMetaTransactionMutationResponse> => {
    const { metaTransaction } = readMetaTransaction(data)

    if (!metaTransaction) {
      throw new Error("Meta transaction action has no meta transaction data")
    }

    const {
      clientMessage,
      clientSignatureStandard,
      functionSignature,
      verifyingContract,
    } = metaTransaction

    const clientSignature = await Wallet.UNSAFE_get().signTypedData(
      clientMessage,
      { clientSignatureStandard },
    )

    return mutateGlobal<traderRelayMetaTransactionMutation>(
      graphql`
        mutation traderRelayMetaTransactionMutation(
          $clientSignature: String!
          $functionSignature: String!
          $verifyingContract: AccountRelayID!
        ) {
          blockchain {
            metaTransactions {
              relay(
                identity: {}
                clientSignature: $clientSignature
                functionSignature: $functionSignature
                verifyingContract: $verifyingContract
              ) {
                transactionHash
                blockExplorerLink
                chain {
                  identifier
                }
              }
            }
          }
        }
      `,
      {
        clientSignature,
        functionSignature,
        verifyingContract,
      },
    )
  },

  swap: async ({ actionType, transaction }: Action): Promise<string> => {
    if (actionType !== "ASSET_SWAP") {
      throw new Error(
        `Unexpected approval action type. Expected: ASSET_SWAP; Got: ${actionType}`,
      )
    }
    if (!transaction) {
      throw new Error("Swap action has no transaction")
    }
    return Wallet.UNSAFE_get().transact(readTransaction(transaction))
  },

  createOrder: async ({
    data,
    onCreateOrder,
  }: {
    data: FragmentRef<trader_sign_and_post>
    onCreateOrder?: () => unknown
  }): Promise<traderCreateOrderMutationResponse> => {
    const { orderData, clientSignature, serverSignature } = await Trader.sign(
      data,
    )

    if (!orderData || !serverSignature) {
      throw new Error("Required data for order creation not found.")
    }

    onCreateOrder?.()

    return mutateGlobal<traderCreateOrderMutation>(
      graphql`
        mutation traderCreateOrderMutation(
          $orderData: JSONString!
          $clientSignature: String!
          $serverSignature: String!
        ) {
          orders {
            create(
              orderData: $orderData
              clientSignature: $clientSignature
              serverSignature: $serverSignature
            ) {
              counterOrder {
                relayId
              }
              order {
                relayId
              }
              transaction {
                blockExplorerLink
                transactionHash
              }
            }
          }
        }
      `,
      {
        orderData,
        clientSignature,
        serverSignature,
      },
    )
  },

  cancelOrder: async ({
    data,
    onCancelOrder,
  }: {
    data: FragmentRef<trader_sign_and_post>
    onCancelOrder?: () => unknown
  }): Promise<traderCancelOrderMutationResponse> => {
    const { orderId, clientSignature } = await Trader.sign(data)

    if (!orderId) {
      throw new Error("No order ID to cancel found.")
    }

    onCancelOrder?.()

    return mutateGlobal<traderCancelOrderMutation>(
      graphql`
        mutation traderCancelOrderMutation(
          $orderId: OrderV2RelayID!
          $clientSignature: String!
        ) {
          orders {
            cancel(order: $orderId, clientSignature: $clientSignature) {
              relayId
            }
          }
        }
      `,
      { orderId, clientSignature },
    )
  },

  sign: async (
    data: FragmentRef<trader_sign_and_post>,
  ): Promise<
    Pick<
      NonNullable<trader_sign_and_post["signAndPost"]>,
      "orderData" | "orderId" | "serverSignature"
    > & { clientSignature: string }
  > => {
    const { signAndPost } = readSignAndPost(data)

    if (!signAndPost) {
      throw new Error("No post action found.")
    }

    const {
      clientMessage,
      clientSignatureStandard,
      serverSignature,
      orderData,
      orderId,
    } = signAndPost

    const clientSignature = await Wallet.UNSAFE_get().sign(clientMessage, {
      clientSignatureStandard,
    })

    if (!clientSignature) {
      throw new Error("Client signature was invalid")
    }

    return { orderData, orderId, clientSignature, serverSignature }
  },

  getTransaction: async (
    transactionHash: string,
    chain: ChainIdentifier,
    fetchConfig?: FetchConfig,
  ): Promise<string | undefined> => {
    const query = await fetch<traderTransactionQuery>(
      graphql`
        query traderTransactionQuery(
          $transactionHash: String!
          $chain: ChainScalar!
        ) {
          transaction(transactionHash: $transactionHash, chain: $chain) {
            blockHash
          }
        }
      `,
      { transactionHash: transactionHash, chain: chain },
      fetchConfig,
    )
    return query?.transaction?.blockHash
  },

  pollTransaction: async ({
    transactionHash,
    chain,
    onPoll,
  }: {
    transactionHash: string
    chain: ChainIdentifier
    onPoll?: () => unknown
  }): Promise<string | undefined> =>
    poll({
      delay: POLL_DELAY,
      fn: () => {
        clearCache()
        onPoll?.()
        return Trader.getTransaction(transactionHash, chain, { force: true })
      },
      maxTries: MAX_POLL_TRANSACTION_ATTEMPTS,
    }).value,

  pollBridgingEvents: async (address: string): Promise<boolean | undefined> =>
    poll({
      delay: BRIDGING_POLL_DELAY,
      fn: async () => {
        clearCache()
        const data = await fetch<traderBridgingEventsQuery>(
          graphql`
            query traderBridgingEventsQuery($identity: IdentityInputType!) {
              blockchain {
                bridgeEvents(account: $identity) {
                  quantity
                }
              }
            }
          `,
          { identity: { address } },
        )
        if (data.blockchain.bridgeEvents.length === 0) {
          return true
        }
        return undefined
      },
      maxTries: MAX_POLL_TRANSACTION_ATTEMPTS,
    }).value,

  getFulfillmentActions: async (
    relayId: string,
    takerAssetFillAmount: string,
    fetchConfig?: FetchConfig,
  ): Promise<ReadonlyArray<Action>> => {
    const { accountKey } =
      await Wallet.UNSAFE_get().UNSAFE_getActiveAccountAndProviderOrRedirect()
    const { order } = await fetch<traderOrderFulfillmentActionsQuery>(
      graphql`
        query traderOrderFulfillmentActionsQuery(
          $relayId: OrderRelayID!
          $taker: IdentityInputType!
          $takerAssetFillAmount: String!
        ) {
          order(order: $relayId) {
            fulfillmentActions(
              taker: $taker
              takerAssetFillAmount: $takerAssetFillAmount
            ) {
              actions {
                actionType
                transaction {
                  ...trader_transaction
                }
              }
            }
          }
        }
      `,
      { relayId, taker: accountKey, takerAssetFillAmount },
      fetchConfig,
    )
    return order?.fulfillmentActions.actions || []
  },
}
export default Trader

export const readTransaction = inlineFragmentize<
  trader_transaction,
  Transaction
>(
  graphql`
    fragment trader_transaction on TransactionSubmissionDataType @inline {
      chainIdentifier
      source {
        value
      }
      destination {
        value
      }
      value
      data
    }
  `,
  ({ chainIdentifier, source, destination, value, data }) => ({
    chain: chainIdentifier,
    source: source?.value,
    destination: destination?.value,
    value: value ? bn(value) : undefined,
    data: data || undefined,
  }),
)

const readSignAndPost = inlineFragmentize<trader_sign_and_post>(
  graphql`
    fragment trader_sign_and_post on ActionType @inline {
      signAndPost {
        orderData
        serverSignature
        clientMessage
        clientSignatureStandard
        orderId
      }
    }
  `,
  signAndPost => signAndPost,
)

export const readMetaTransaction = inlineFragmentize<trader_meta_transaction>(
  graphql`
    fragment trader_meta_transaction on ActionType @inline {
      metaTransaction {
        clientMessage
        clientSignatureStandard
        functionSignature
        verifyingContract
      }
    }
  `,
  metaTransaction => metaTransaction,
)
