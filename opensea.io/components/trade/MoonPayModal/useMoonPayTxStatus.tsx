import { useEffect, useState } from "react"
import { BigNumber } from "@0xproject/utils/lib/configured_bignumber"
import { useInterval } from "react-use"
import { ChainIdentifier } from "../../../constants"
import useAppContext from "../../../hooks/useAppContext"
import { useMountEffect } from "../../../hooks/useMountEffect"
import { UnreachableCaseError } from "../../../lib/helpers/type"
import { TxStatus } from "./types"
import { getMoonPayApiRetrieveExtTxUrl } from "./utils"

const MOONPAY_WALLET_BALANCE_POLL_INTERVAL = 5_000
const MOONPAY_TX_STATUS_POLL_INTERVAL = 3_000
type MoonPayTxStatus =
  | "waitingPayment"
  | "pending"
  | "waitingAuthorization"
  | "failed"
  | "completed"
export type MoonPayApiRetrieveExtTxResponse = [
  {
    status: MoonPayTxStatus
  },
]

export const useMoonPayTxStatus = ({
  externalTransactionId,
  onTxCompleted,
  onTxStatusChange,
  symbol = "ETH",
  chain,
}: {
  externalTransactionId: string
  onTxCompleted: () => void
  onTxStatusChange?: (txStatus: TxStatus) => void
  symbol?: string
  chain?: ChainIdentifier
}) => {
  const { wallet } = useAppContext()
  const [lastStatus, setLastStatus] = useState<MoonPayTxStatus>()
  const [lastBalance, setLastBalance] = useState<BigNumber>()

  useMountEffect(() => {
    const setInitialBalance = async () => {
      const balance = await wallet.getBalanceBySymbol(symbol, chain)
      setLastBalance(balance)
    }
    setInitialBalance()
  })

  useEffect(() => {
    let cancelled = false
    let pollTxStatusInterval: NodeJS.Timer | null = null
    const pollTxStatus = async () => {
      if (!externalTransactionId) {
        return
      }
      const response = await fetch(
        getMoonPayApiRetrieveExtTxUrl(externalTransactionId),
      )
      if (!response.ok) {
        // Transaction does not exist yet
        return
      }
      const [{ status }]: MoonPayApiRetrieveExtTxResponse =
        await response.json()

      if (!cancelled && status !== lastStatus) {
        switch (status) {
          case "waitingPayment":
          case "pending":
          case "waitingAuthorization":
            onTxStatusChange?.("pending")
            break
          case "completed":
            onTxStatusChange?.("successful")
            break
          case "failed":
            onTxStatusChange?.("failed")
            break
          default:
            throw new UnreachableCaseError(status)
        }
        setLastStatus(status)
      }
    }

    if (externalTransactionId) {
      pollTxStatusInterval = setInterval(
        pollTxStatus,
        MOONPAY_TX_STATUS_POLL_INTERVAL,
      )
    }

    return () => {
      cancelled = true
      if (pollTxStatusInterval) {
        clearInterval(pollTxStatusInterval)
      }
    }
  }, [externalTransactionId, lastStatus, onTxCompleted, onTxStatusChange])

  const checkIfFundsAreAvailable = async () => {
    if (lastStatus !== "completed") {
      return
    }
    if (lastBalance === undefined) {
      return
    }
    const balance = await wallet.getBalanceBySymbol(symbol, chain)
    if (balance.greaterThan(lastBalance)) {
      onTxCompleted()
    }
  }

  useInterval(checkIfFundsAreAvailable, MOONPAY_WALLET_BALANCE_POLL_INTERVAL)

  return { status: lastStatus }
}
