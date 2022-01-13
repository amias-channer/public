import { groupBy, mapValues, orderBy } from "lodash"
import { WalletFundsQuery } from "../../../lib/graphql/__generated__/WalletFundsQuery.graphql"
import { bn } from "../../../lib/helpers/numberUtils"

const FUNDS_PREDEFINED_ORDER = ["ETH", "WETH", "USDC"]

type WalletFund = NonNullable<
  WalletFundsQuery["response"]["wallet"]
>["funds"][number]

export const orderWalletFunds = <
  T extends Pick<WalletFund, "chain" | "symbol">,
>(
  funds: ReadonlyArray<T>,
) => {
  const bySymbol = groupBy(funds, o => o.symbol)
  const bySymbolAndChain = mapValues(bySymbol, v => orderBy(v, ["chain"]))

  return Object.keys(bySymbolAndChain)
    .sort((a, b) => {
      const o1 = FUNDS_PREDEFINED_ORDER.indexOf(a)
      const o2 = FUNDS_PREDEFINED_ORDER.indexOf(b)
      if (o1 === -1 && o2 === -1) {
        return a.localeCompare(b)
      }
      if (o1 === -1) return 1
      if (o2 === -1) return -1
      return o1 - o2
    })
    .reduce(
      (acc, symbol) => [...acc, ...bySymbolAndChain[symbol]],
      [] as ReadonlyArray<T>,
    )
}

export const calculateFundsBalance = (funds: ReadonlyArray<WalletFund>) => {
  return funds.reduce(
    (sum, fund) =>
      fund.usdPrice ? sum.plus(bn(fund.quantity).times(fund.usdPrice)) : sum,
    bn(0),
  )
}

export const isWrappedToken = (symbol: string) => {
  return symbol.charAt(0) === "W"
}
