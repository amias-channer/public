import moment, { Moment } from "moment"
import { buildAccount, Account } from "./accounts"

export interface Transaction {
  id: number
  transactionHash: string
  transactionIndex: number
  blockNumber: number
  timestamp?: Moment
  blockHash: string
  fromAccount?: Account
  toAccount?: Account
  logIndex: number
}

/**
 * Create a Transaction from API data
 * @param txnData data from server
 */
export function buildTransaction(txnData: any): Transaction {
  const txn: Transaction = {
    id: txnData["id"],
    transactionHash: txnData["transaction_hash"],
    transactionIndex: parseInt(txnData["transaction_index"]),
    blockNumber: txnData["block_number"],
    timestamp: txnData["timestamp"]
      ? moment.utc(txnData["timestamp"])
      : undefined,
    blockHash: txnData["block_hash"],
    fromAccount: txnData["from_account"]
      ? buildAccount(txnData["from_account"])
      : undefined,
    toAccount: txnData["to_account"]
      ? buildAccount(txnData["to_account"])
      : undefined,
    logIndex: parseInt(txnData["log_index"]),
  }
  return txn
}
