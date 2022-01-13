import React from "react"
import BigNumber from "bignumber.js"
import styled from "styled-components"
import ExchangeActions from "../../actions/exchange"
import {
  AUTHORIZING_IMG,
  BUNDLE_IMG,
  CARD_PACK_IMG,
  CARD_TRADE_BG,
  OFFERS_IMG,
  OPENSEA_UNLOCK_IMG,
} from "../../constants"
import Loader from "../../design-system/Loader/Loader.react"
import Modal from "../../design-system/Modal"
import { addressToToken } from "../../lib/helpers/addresses"
import { normalizePriceDisplay } from "../../lib/helpers/numberUtils"
import Router from "../../lib/helpers/router"
import { ExchangeState } from "../../reducers/exchange"
import { Token } from "../../reducers/tokens"
import { getState, dispatch } from "../../store"
import { $bp_small } from "../../styles/variables"
import AddFunds from "../common/AddFunds.react"
import Link from "../common/Link.react"
import Loading from "../common/Loading.react"
import Panel from "../layout/Panel.react"
import StoreComponent from "../StoreComponent.react"

interface ExchangeModalProps {
  accountAddress: string
  imageUrl?: string
  onCreateOrder?: () => void
  onCompleteOrder?: () => void
}

interface State {}

export default class ExchangeModal extends StoreComponent<
  ExchangeModalProps,
  State
> {
  previousExchangeState: ExchangeState = getState().exchange

  componentDidMount() {
    super.componentDidMount()
    Router.prefetch("/success")
  }

  componentDidUpdate() {
    const { exchange } = this.store
    if (exchange.creatingOrder && !this.previousExchangeState.creatingOrder) {
      this.props.onCreateOrder && this.props.onCreateOrder()
    }
    if (!exchange.creatingOrder && this.previousExchangeState.creatingOrder) {
      this.props.onCompleteOrder && this.props.onCompleteOrder()
    }
    if (
      exchange.fulfillingOrder &&
      exchange.pendingTransactionHash &&
      !this.previousExchangeState.pendingTransactionHash
    ) {
      // We started a transaction
      dispatch(ExchangeActions.reset())
      Router.push("/success")
      return
    }
    this.previousExchangeState = exchange
  }

  renderAddFundsSection(tokenNeeded?: Token) {
    const { accountAddress } = this.props
    if (!accountAddress) {
      return null
    }
    return (
      <div className="center-align padded margin-top">
        <AddFunds
          accountAddress={accountAddress}
          className="btn btn-blue btn-large"
          token={tokenNeeded}
        />
      </div>
    )
  }

  renderInitializingProxy = () => {
    return (
      <>
        <Modal.Header>
          <Modal.Title>Initialize your account</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            To allow people on OpenSea to make offers your items, you must first
            complete a free (plus gas) transaction. Check your wallet!
          </p>
          <p>
            Keep this tab open while we wait for the blockchain to confirm your
            action.{" "}
            <strong>This only needs to be done once for your account.</strong>
          </p>
          <div className="ExchangeModal--explainer">
            <Panel icon="info" mode="start-closed" title="More info">
              <p>
                Before you can list an item for sale or accept an offer on
                OpenSea, you need to set yourself up for trading. There's no
                charge from us, but you'll have to pay a one-time gas fee
                (network transaction cost) to initialize your wallet at the
                blockchain level. For info on how the process works,{" "}
                <Link
                  href="/faq#i-want-to-make-my-first-listing"
                  rel="noreferrer"
                  target="_blank"
                >
                  click here
                </Link>
                . Otherwise, confirm the transaction in your wallet and wait for
                it to complete.
              </p>
              <p>
                If the transaction is taking a while, feel free to close the
                browser window. When you come back to set up the listing later,
                we'll recognize that your wallet is ready for trading, and
                you'll be able to post your listing with no further charge.
              </p>
              <p>
                After the transaction completes, you'll need to press "Post Your
                Listing" once more if you've left the page open or set up the
                listing again if you closed the browser. After that, your item
                will be listed for sale.
              </p>
              <p>
                Next time you set up a listing, the process will be completely
                free!
              </p>
            </Panel>
          </div>
          <div className="modal-image-wrapper">
            <img src={OFFERS_IMG} />
          </div>
          <div className="ExchangeModal--loader">
            <Loader size="large" />
            <p className="ExchangeModal--loader-instructions">
              Please confirm the transaction with your wallet and then wait for
              the transaction to complete
            </p>
          </div>
        </Modal.Body>
      </>
    )
  }

  renderIsApproving(
    transactionNotice: string | null,
    approvingCurrency: boolean,
    approvingAllAssets: boolean,
  ) {
    return (
      <>
        <Modal.Header>
          <Modal.Title>{transactionNotice}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            To approve OpenSea to trade this token, you must first complete a
            free (plus gas) transaction. Confirm it in your wallet and keep this
            tab open!{" "}
            {approvingCurrency ? (
              <span>
                You might notice a very large number being requested for
                approval - this is simply the maximum amount, meaning{" "}
                <strong>you'll never have to do this approval again</strong>. It
                also doesn't allow OpenSea to transfer that amount for you -{" "}
                <strong>
                  the amount you sign in the next step is all that can be traded
                  on your behalf
                </strong>
                . Read more{" "}
                <a href="/faq#weth" rel="noreferrer" target="_blank">
                  here
                </a>
                .
              </span>
            ) : approvingAllAssets ? (
              <strong>
                This only needs to be done once for all items of this type.
              </strong>
            ) : null}
          </p>
          <div className="modal-image-wrapper">
            <img src={CARD_PACK_IMG} />
            <img
              className="modal-asset-img centered"
              src={OPENSEA_UNLOCK_IMG}
            />
          </div>
          <Loading blockchain />
        </Modal.Body>
      </>
    )
  }

  renderIsAuthorizingOrder = (transactionNotice: string | null) => {
    return (
      <>
        <Modal.Header>
          <Modal.Title>
            {this.tr("Authorizing your account for this order...")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {transactionNotice}

          <p className="center-align">
            {this.tr(
              'If a signature request pops up, just click "Sign" to verify that you own your wallet.',
            )}
          </p>
          <div className="modal-image-wrapper">
            <img src={AUTHORIZING_IMG} />
          </div>
          <Loading relative />
        </Modal.Body>
      </>
    )
  }

  renderCompletingTransaction(
    tokenNeeded: Token | null,
    wrappingEth: boolean,
    transactionValue: string | BigNumber | null,
    transactionNotice: string | null,
  ) {
    const { imageUrl } = this.props
    return (
      <>
        <Modal.Header>
          <Modal.Title>
            {this.tr(
              tokenNeeded
                ? `Add funds to complete this transaction`
                : `Completing the ${wrappingEth ? "transaction" : "trade"}...`,
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {tokenNeeded && transactionValue ? (
            <p>
              You don't have enough {tokenNeeded.symbol} to make this
              transaction. Your current wallet needs{" "}
              {normalizePriceDisplay(transactionValue)} {tokenNeeded.symbol}.
            </p>
          ) : (
            <p>{transactionNotice}</p>
          )}
          <div className="modal-image-wrapper">
            <img src={CARD_TRADE_BG} />
            <img className="modal-asset-img" src={imageUrl || BUNDLE_IMG} />
          </div>
          {tokenNeeded ? (
            this.renderAddFundsSection(tokenNeeded)
          ) : (
            <Loading blockchain />
          )}
        </Modal.Body>
      </>
    )
  }

  render() {
    const {
      initializingProxy,
      approvingAsset,
      approvingAllAssets,
      fulfillingOrder,
      approvingCurrency,
      authorizingOrder,
      transactionNotice,
      transactionValue,
      addressOfMissingToken,
      wrappingEth,
    } = this.store.exchange

    const modalOpen =
      initializingProxy ||
      approvingAllAssets ||
      approvingAsset ||
      fulfillingOrder ||
      approvingCurrency ||
      authorizingOrder ||
      wrappingEth

    const isApprovingAssetOrCurrency =
      approvingAllAssets || approvingAsset || approvingCurrency

    const tokenNeeded = addressOfMissingToken
      ? addressToToken(addressOfMissingToken)
      : null

    return (
      <Modal
        isOpen={modalOpen}
        onClose={() => dispatch(ExchangeActions.reset())}
      >
        <DivContainer>
          {initializingProxy
            ? this.renderInitializingProxy()
            : isApprovingAssetOrCurrency
            ? this.renderIsApproving(
                transactionNotice,
                approvingCurrency,
                approvingAllAssets,
              )
            : authorizingOrder
            ? this.renderIsAuthorizingOrder(transactionNotice)
            : this.renderCompletingTransaction(
                tokenNeeded,
                wrappingEth,
                transactionValue,
                transactionNotice,
              )}
        </DivContainer>
      </Modal>
    )
  }
}

const DivContainer = styled.div`
  display: flex;
  flex-direction: column;

  .modal-image-wrapper {
    position: relative;
    margin-top: 25px;
    text-align: center;
    overflow: hidden;

    img {
      max-width: 100%;
    }

    .modal-asset-img {
      position: absolute;
      left: 50%;
      top: 8%;
      max-width: 105px;
      max-height: 150px;
      transform: translateX(-120%);

      &.centered {
        transform: translateX(-50%);
      }

      @media (max-width: ${$bp_small}) {
        max-height: 123px;
        max-width: 87px;
        transform: translateX(-119%);
      }
    }
  }

  .ExchangeModal--explainer {
    margin: 24px 0;
  }

  .ExchangeModal--loader {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 32px;
  }

  .ExchangeModal--loader-instructions {
    text-align: center;
  }
`
