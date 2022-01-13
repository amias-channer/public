import React from "react"
import BigNumber from "bignumber.js"
import _ from "lodash"
import qs from "qs"
import { Unsubscribe } from "redux"
import ExchangeActions from "../../actions/exchange"
import {
  IS_SERVER,
  WYRE_ACCOUNT_ID,
  WYRE_REDIRECT_PARAMS,
  WYRE_SUPPORTED_PAYMENT_TOKEN_SYMBOLS,
} from "../../constants"
import Popover from "../../design-system/Popover"
import Tooltip from "../../design-system/Tooltip"
import { trackClickWyreAddFunds } from "../../lib/analytics/events/checkoutEvents"
import Router from "../../lib/helpers/router"
import { Token } from "../../reducers/tokens"
import ExternalLink from "./ExternalLink.react"
import Icon from "./Icon.react"

// Max $/day allowed in Wyre
// $25/day; $500/month; $2000/year
// const DEBITCARD_CUTOFF_USD = 250

type PaymentMethod = "apple-pay" | "debit-card"

interface AddFundsProps {
  children?: React.ReactNode
  token?: Token
  accountAddress: string
  className?: string
}

interface State {
  tokenBalance?: BigNumber
}

export default class AddFunds extends React.Component<AddFundsProps, State> {
  static defaultProps = {
    className: "",
  }

  state: State = {}

  unsub: Unsubscribe | undefined = undefined

  async componentDidMount() {
    const { token, accountAddress } = this.props
    const tokenBalance = await ExchangeActions._getBalance(
      accountAddress,
      token,
    )
    this.setState({ tokenBalance })
  }

  // TODO move link tracking into an ExternalLink component
  trackWyre = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const aTag = e.currentTarget
    const { token } = this.props
    trackClickWyreAddFunds({ href: aTag.href, token })
  }

  getWyreUrl(paymentMethod: PaymentMethod) {
    const { accountAddress, token } = this.props
    const orderedCurrencies = _.sortBy(
      WYRE_SUPPORTED_PAYMENT_TOKEN_SYMBOLS,
      s => s !== token?.symbol,
    )
    const opts = {
      destCurrency: orderedCurrencies.join(","),
      dest: `ethereum:${accountAddress}`,
      paymentMethod,
      // The following data will be passed to the redirectUrl as url query parameters: transferId, orderId, accountId, dest, fees, and destAmount
      redirectUrl: IS_SERVER
        ? undefined
        : `${Router.getHrefWithMergedQuery({
            [WYRE_REDIRECT_PARAMS.DidRedirect]: "true",
          })}`,
      failureRedirectUrl: IS_SERVER
        ? undefined
        : `${Router.getHrefWithMergedQuery({
            [WYRE_REDIRECT_PARAMS.DidFailAndRedirect]: "true",
          })}`,
      accountId: WYRE_ACCOUNT_ID,
    }
    return `https://pay.sendwyre.com/purchase?${qs.stringify(opts)}`
  }

  render() {
    const { className, children, token } = this.props
    // const { tokenBalance } = this.state
    const tokenSymbol = token?.symbol || "ETH"
    // const isMainnet = !getIsRinkeby()
    // const usdPrice = getUSDPrice(token || getEth())
    // const usdBalance = tokenBalance?.times(usdPrice) || bn(0)

    if (!["ETH", "USDC"].includes(tokenSymbol)) {
      return (
        <Tooltip
          content={
            <div className="AddFunds">
              <div className={`AddFunds--dropdown ${className}`}>
                Buy {tokenSymbol} on Uniswap{" "}
                <Icon className="right" value="swap_vertical_circle" />
              </div>
            </div>
          }
        >
          <ExternalLink
            url={`https://uniswap.exchange/swap/?outputCurrency=${token?.address}`}
          />
        </Tooltip>
      )
    }

    return (
      <div className={`AddFunds`}>
        <Popover
          content={() => (
            <>
              <p>Coming soon™</p>
              <p>
                In the meantime, you can <br />
                purchase Ethereum on{" "}
                <ExternalLink url={"https://coinbase.com"}>
                  Coinbase
                </ExternalLink>
                .
              </p>
            </>
          )}
        >
          <>
            {children ? (
              children
            ) : (
              <>
                Add Funds <Icon className="right" value="credit_card" />
              </>
            )}
          </>
        </Popover>
      </div>
    )
  }
}
