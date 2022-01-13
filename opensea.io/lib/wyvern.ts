import BigNumber from "bignumber.js"
import { encodeCall } from "opensea-js"
import {
  NULL_BLOCK_HASH,
  NULL_ADDRESS,
  OPENSEA_SELLER_BOUNTY_BASIS_POINTS,
  DEFAULT_SELLER_FEE_BASIS_POINTS,
  OPENSEA_FEE_RECIPIENT,
} from "opensea-js/lib/constants"
import { OrderSide, SaleKind, HowToCall, FeeMethod } from "opensea-js/lib/types"
import { estimateCurrentPrice } from "opensea-js/lib/utils"
import * as Web3 from "web3"
import { ExtendedOrder } from "../reducers/auctions"
import chain from "./chain/chain"
import Ethereum from "./chain/networks/ethereum"
import Web3EvmProvider from "./chain/providers/web3EvmProvider"
import { addressesEqual } from "./helpers/addresses"
import { promisify0, promisify1 } from "./helpers/promise"
export const computeCurrentPrice = estimateCurrentPrice
export const feeRecipient = OPENSEA_FEE_RECIPIENT
export {
  encodeCall,
  OrderSide,
  SaleKind,
  HowToCall,
  FeeMethod,
  NULL_BLOCK_HASH,
  NULL_ADDRESS,
  OPENSEA_SELLER_BOUNTY_BASIS_POINTS,
  DEFAULT_SELLER_FEE_BASIS_POINTS,
}

/**
 * Check whether two orders can match
 * @param buyOrder buy order to check
 * @param sellOrder sell order to check
 */
export function canMatchOrders(
  buyOrder?: ExtendedOrder,
  sellOrder?: ExtendedOrder,
): boolean {
  if (!buyOrder || !sellOrder) {
    return false
  }
  if (buyOrder.paymentToken != sellOrder.paymentToken) {
    return false
  }
  if (
    buyOrder.currentPrice &&
    sellOrder.currentPrice &&
    +buyOrder.currentPrice < +sellOrder.currentPrice
  ) {
    return false
  }
  if (
    sellOrder.taker != NULL_ADDRESS &&
    !addressesEqual(sellOrder.taker, buyOrder.maker)
  ) {
    return false
  }
  if (
    buyOrder.taker != NULL_ADDRESS &&
    !addressesEqual(buyOrder.taker, sellOrder.maker)
  ) {
    return false
  }
  return true
}

// OTHER

export type Web3Callback<T> = (err: Error | null, result: T) => void
export type TxnCallback = (
  result: boolean,
  receipt: Web3.TransactionReceipt | null,
) => void

const txCallbacks: { [txHash: string]: TxnCallback[] } = {}

export const getWeb3 = (): Web3 => {
  const web3 = chain.providers.find(
    (provider): provider is Web3EvmProvider =>
      provider instanceof Web3EvmProvider,
  )?.web3
  if (!web3) {
    throw new Error("No Web3 provider found.")
  }
  return web3
}

const track = (txHash: string, onFinalized: TxnCallback) => {
  if (txCallbacks[txHash]) {
    txCallbacks[txHash].push(onFinalized)
  } else {
    txCallbacks[txHash] = [onFinalized]
    const poll = async () => {
      const web3 = getWeb3()
      const tx = await promisify1(web3.eth.getTransaction)(txHash)
      if (tx && tx.blockHash && tx.blockHash !== NULL_BLOCK_HASH) {
        const receipt = await promisify1(web3.eth.getTransactionReceipt)(txHash)
        if (!receipt) {
          // Hack: assume success if no receipt
          console.warn("No receipt found for ", txHash)
        }
        const status = receipt
          ? parseInt((receipt.status || "0").toString()) == 1
          : true
        txCallbacks[txHash].map(f => f(status, receipt))
        delete txCallbacks[txHash]
      } else {
        setTimeout(poll, 1000)
      }
    }
    poll().catch()
  }
}

/**
 * Confirm a tx
 * @param txHash hash of tx
 */
export async function confirmTransaction(
  txHash: string,
): Promise<Web3.TransactionReceipt | null> {
  return new Promise((resolve, reject) => {
    track(
      txHash,
      (didSucceed: boolean, receipt: Web3.TransactionReceipt | null) => {
        if (didSucceed) {
          resolve(receipt)
        } else {
          reject(
            new Error(
              `Transaction failed :( You might have already completed this action. See more here: ${Ethereum.getTransactionUrl(
                txHash,
              )}`,
            ),
          )
        }
      },
    )
  })
}

/**
 * Special fixes for making BigNumbers using web3 results
 * @param arg An arg or the result of a web3 call to turn into a BigNumber
 */
export function makeBigNumber(arg: number | string | BigNumber): BigNumber {
  // Zero sometimes returned as 0x from contracts
  if (arg === "0x") {
    arg = 0
  }
  // fix "new BigNumber() number type has more than 15 significant digits"
  arg = arg.toString()
  return new BigNumber(arg)
}

/**
 * Send a transaction to the blockchain and optionally confirm it
 * @param param0 __namedParameters
 * @param fromAddress address sending transaction
 * @param toAddress destination contract address
 * @param data data to send to contract
 * @param value value in ETH to send with data. Defaults to 0
 * @param awaitConfirmation whether to wait for transaction to confirm on the blockchain
 */
export async function sendRawTransaction({
  fromAddress,
  toAddress,
  value,
  data,
  gas,
  awaitConfirmation = false,
}: {
  fromAddress: string
  toAddress?: string
  value?: number | string | BigNumber
  data?: string
  gas?: number
  awaitConfirmation?: boolean
}) {
  const gasPrice = await getGasPrice()
  const web3 = getWeb3()
  const txHash = await promisify1(web3.eth.sendTransaction)({
    from: fromAddress,
    to: toAddress,
    value,
    data,
    gas,
    gasPrice,
  })

  if (awaitConfirmation) {
    await confirmTransaction(txHash)
  }

  return txHash
}

/**
 * Get gas price for sending a txn, in wei
 * Will be slightly above the mean to make it faster
 */
export async function getGasPrice(): Promise<BigNumber> {
  const web3 = getWeb3()
  const gweiToAdd = 3
  const weiToAdd = web3.toWei(gweiToAdd, "gwei")
  const meanGas = await promisify0(web3.eth.getGasPrice)()
  return meanGas.plus(weiToAdd)
}

/**
 * Estimate Gas usage for a transaction
 * @param web3 Web3 instance
 * @param fromAddress address sending transaction
 * @param toAddress destination contract address
 * @param data data to send to contract
 * @param value value in ETH to send with data
 */
export async function estimateGas(
  web3: Web3,
  { from, to, data, value = 0 }: Web3.TxData,
): Promise<number> {
  const amount = await promisify1(web3.eth.estimateGas)({
    from,
    to,
    value,
    data,
  })

  return amount
}

/**
 * Estimate price for a transaction in ETH
 * @param web3 Web3 instance
 * @param fromAddress address sending transaction
 * @param toAddress destination contract address
 * @param data data to send to contract
 * @param value value in ETH to send with data
 */
export async function estimateTotalPrice(
  web3: Web3,
  { from, to, data, value = 0 }: Web3.TxData,
): Promise<BigNumber> {
  const gas = await estimateGas(web3, { from, to, data, value })
  const gasPrice = await getGasPrice()

  return web3.fromWei(gasPrice.times(gas), "ether").plus(value)
}

/**
 * Delay using setTimeout
 * @param ms milliseconds to wait
 */
export async function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}
