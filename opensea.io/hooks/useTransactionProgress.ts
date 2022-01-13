import { useState } from "react"
import { ChainIdentifier } from "../constants"
import Trader from "../lib/chain/trader"
import useToasts from "./useToasts"

export const useTransactionProgress = () => {
  const [progress, setProgress] = useState(0)
  const { showErrorMessage } = useToasts()

  const waitForTransaction = async ({
    hash,
    chain,
    onSuccess,
  }: {
    hash: string
    chain: ChainIdentifier
    onSuccess: () => unknown
  }) => {
    setProgress(15)
    try {
      setProgress(25)
      const blockhash = await Trader.pollTransaction({
        transactionHash: hash,
        chain,
        onPoll: () => setProgress(prev => prev + 5),
      })

      if (blockhash) {
        setProgress(100)
        onSuccess()
      } else {
        showErrorMessage(
          "Timed out while waiting for the transaction to finish.",
        )
      }
    } catch (error) {
      setProgress(0)
      throw error
    }
  }

  return { progress, waitForTransaction, setProgress }
}
