import React from "react"
import styled from "styled-components"
import ErrorActions from "../../actions/errors"
import AppComponent from "../../AppComponent.react"
import {
  ChainIdentifier,
  CHAIN_IDENTIFIERS_TO_NAMES,
  CHAIN_IDENTIFIER_INFORMATION,
} from "../../constants"
import { Alert } from "../../design-system/Alert"
import Block from "../../design-system/Block"
import Checkbox from "../../design-system/Checkbox"
import Flex from "../../design-system/Flex"
import {
  MultiStepContext,
  withMultiStepFlowContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import Skeleton from "../../design-system/Skeleton"
import Text from "../../design-system/Text"
import Ethereum from "../../lib/chain/networks/ethereum"
import Trader, {
  Action as TraderAction,
  ActionTransaction,
  readMetaTransaction,
  readTransaction,
} from "../../lib/chain/trader"
import {
  ActionPanel_data,
  ActionTypes,
} from "../../lib/graphql/__generated__/ActionPanel_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { first } from "../../lib/helpers/array"
import { bn } from "../../lib/helpers/numberUtils"
import { wait } from "../../lib/helpers/promise"
import { querySwapActions } from "../../lib/helpers/swap"
import { dispatch } from "../../store"
import ActionButton from "../common/ActionButton.react"
import Icon from "../common/Icon.react"
import Link from "../common/Link.react"
import NumericInput from "../forms/NumericInput.react"
import { FrameConfiscator } from "../layout/Frame.react"
import Panel from "../layout/Panel.react"
import AddFundsModal from "../trade/AddFundsModal.react"
import ActionProgress from "./ActionProgress.react"

interface ActionItem {
  start?: () => unknown
  title: string
  content: React.ReactNode
  buttonText?: string
  symbol?: string
  isButtonDisabled?: boolean
}

interface State {
  amount?: string
  amountValue: string
  isWaiting?: boolean
  progress: number
  isFreezeMetadataChecked: boolean
}

type Props = MultiStepContext & {
  step: number
  onEnd: (transaction?: ActionTransaction) => unknown

  open: boolean
  data: ActionPanel_data
  chain?: ChainIdentifier
}

class ActionPanel extends AppComponent<Props, State> {
  state: State = {
    amount: this.getMinAmount()?.toString(),
    amountValue: this.getMinAmount()?.toString() ?? "",
    progress: 0,
    isFreezeMetadataChecked: false,
  }

  componentDidMount() {
    this.waitForBalance()
  }

  componentDidUpdate() {
    this.waitForBalance()
  }

  getActiveChain = (): ChainIdentifier => {
    const { chain } = this.context
    if (!chain) {
      throw new Error("No chain found.")
    }
    return chain
  }

  waitForTransaction = async (
    getTransactionPromise: () => Promise<{
      hash: string
      chain: ChainIdentifier
    }>,
  ) => {
    const { onEnd } = this.props
    this.setState({ progress: 15 })
    try {
      const { hash, chain } = await getTransactionPromise()
      this.setState({ progress: 25 })
      const blockhash = await Trader.pollTransaction({
        transactionHash: hash,
        chain,
        onPoll: () =>
          this.setState(prevState => ({ progress: prevState.progress + 5 })),
      })
      if (blockhash) {
        this.setState({ progress: 100 })
        this.showSuccessMessage("Transaction successful!")
        onEnd()
      } else {
        this.showErrorMessage(
          "Timed out while waiting for the transaction to finish.",
        )
      }
    } catch (error) {
      this.setState({ progress: 0 })
      this.showErrorMessage(
        "There was an error with your transaction. Please try again.",
      )
    }
  }

  freezeAssetMetadata = async () => {
    const { data, onEnd } = this.props
    const { metaTransaction } = readMetaTransaction(data)
    let blockExplorerLink
    let chain
    let transactionHash

    try {
      this.setState({ progress: 15 })

      if (metaTransaction) {
        const response = await Trader.relayMetaTransaction({ data })
        transactionHash =
          response.blockchain.metaTransactions.relay?.transactionHash
        chain = response.blockchain.metaTransactions.relay?.chain.identifier
        blockExplorerLink =
          response.blockchain.metaTransactions.relay?.blockExplorerLink

        if (!transactionHash || !chain || !blockExplorerLink) {
          throw new Error("No submitted transaction found.")
        }
      } else {
        const transaction = data.transaction
        if (!transaction) {
          throw new Error("No transaction found.")
        }
        const { wallet } = this.context
        chain = this.context.chain
        transactionHash = await wallet.transact(readTransaction(transaction))

        blockExplorerLink = chain
          ? CHAIN_IDENTIFIER_INFORMATION[chain].getTransactionUrl(
              transactionHash,
            )
          : Ethereum.getTransactionUrl(transactionHash)
      }

      onEnd({
        blockExplorerLink,
        transactionHash,
      })
    } catch (error) {
      this.setState({ progress: 0 })
      dispatch(
        ErrorActions.show(
          error,
          "There was an error in freezing the metadata. Please try again.",
        ),
      )
    }
  }

  approve = async () => {
    const { data } = this.props
    if (!data) {
      throw new Error("No action found.")
    }
    const { metaTransaction } = readMetaTransaction(data)

    this.waitForTransaction(async () => {
      if (metaTransaction) {
        const response = await Trader.relayMetaTransaction({ data })
        const hash = response.blockchain.metaTransactions.relay?.transactionHash
        const chain =
          response.blockchain.metaTransactions.relay?.chain.identifier

        if (!hash || !chain) {
          throw new Error("No submitted meta transaction found.")
        }

        return { hash, chain }
      } else {
        const hash = await Trader.approve(data as TraderAction)
        return { hash, chain: this.getActiveChain() }
      }
    })
  }

  fulfill = async () => {
    const { data, onEnd } = this.props
    try {
      if (!data) {
        throw new Error("No fulfillment action found.")
      }
      this.setState({ progress: 50 })
      await Trader.fulfill(data as TraderAction)
      this.setState({ progress: 100 })
      onEnd()
    } catch (error) {
      this.setState({ progress: 0 })
      dispatch(
        ErrorActions.show(
          error,
          "There was an error in the transaction. Please try again.",
        ),
      )
    }
  }

  createOrder = async () => {
    const { data, onEnd } = this.props

    this.setState({ progress: 30 })

    this.attempt(async () => {
      const order = await Trader.createOrder({
        data,
        onCreateOrder: () => this.setState({ progress: 60 }),
      })

      if (order) {
        onEnd(order.orders.create?.transaction ?? undefined)
      }
    })
  }

  cancelOrder = async () => {
    const { data, onEnd } = this.props

    this.setState({ progress: 30 })

    this.attempt(async () => {
      const order = await Trader.cancelOrder({
        data,
        onCancelOrder: () => this.setState({ progress: 60 }),
      })

      if (order) {
        onEnd()
      }
    })
  }

  transfer = async () => {
    const { data, onEnd } = this.props
    const { metaTransaction } = readMetaTransaction(data)
    let blockExplorerLink
    let chain
    let transactionHash

    try {
      this.setState({ progress: 15 })
      if (metaTransaction) {
        const response = await Trader.relayMetaTransaction({ data })
        transactionHash =
          response.blockchain.metaTransactions.relay?.transactionHash
        chain = response.blockchain.metaTransactions.relay?.chain.identifier
        blockExplorerLink =
          response.blockchain.metaTransactions.relay?.blockExplorerLink

        if (!transactionHash || !chain || !blockExplorerLink) {
          throw new Error("No submitted transaction found.")
        }
      } else {
        const transaction = data.transaction
        if (!transaction) {
          throw new Error("No transaction found.")
        }
        const { wallet } = this.context
        chain = this.context.chain
        transactionHash = await wallet.transact(readTransaction(transaction))

        blockExplorerLink = chain
          ? CHAIN_IDENTIFIER_INFORMATION[chain].getTransactionUrl(
              transactionHash,
            )
          : Ethereum.getTransactionUrl(transactionHash)
      }
      onEnd({
        blockExplorerLink,
        transactionHash,
      })
    } catch (error) {
      this.setState({ progress: 0 })
      dispatch(
        ErrorActions.show(
          error,
          "There was an error in the approval. Please try again.",
        ),
      )
    }
  }

  relayMetaTransaction = async () => {
    const { data } = this.props
    if (!data) {
      throw new Error("No action found.")
    }
    this.waitForTransaction(async () => {
      const response = await Trader.relayMetaTransaction({ data })
      const hash = response.blockchain.metaTransactions.relay?.transactionHash
      const chain = response.blockchain.metaTransactions.relay?.chain.identifier

      if (!hash || !chain) {
        throw new Error("No transaction found.")
      }

      return { hash, chain }
    })
  }

  swap = async () => {
    const { data } = this.props
    await this.waitForTransaction(async () => {
      const hash = await Trader.swap(data)
      return { hash, chain: this.getActiveChain() }
    })
  }

  askForSwap = async () => {
    const {
      data: { askForSwap },
    } = this.props
    const { amount } = this.state
    const { chain } = this.context
    if (!amount || !askForSwap || !chain) {
      this.showErrorMessage("Could not initiate transaction.")
      return
    }

    const { actions } = await querySwapActions({
      amount,
      fromAsset: askForSwap.fromAsset.relayId,
      toAsset: askForSwap.toAsset.relayId,
    })
    const action = first(actions)
    if (!action) {
      this.showErrorMessage("Could not initiate transaction.")
      return
    }
    await this.waitForTransaction(async () => {
      const hash = await Trader.swap(action)
      await wait(1000 * 60) // FIXME: Hack to wait one minute before polling for bridging event
      return { hash, chain: this.getActiveChain() }
    })
  }

  onDepositAction = () => {
    const { data, onNext, onPrevious, onEnd } = this.props
    if (!onNext) {
      return
    }
    const onFundsAdded = () => {
      if (onPrevious) {
        // go back twice to the FulfillActionModal
        onPrevious?.()
        onPrevious?.()
      } else {
        onEnd()
      }
    }
    onNext(
      data.askForDeposit?.asset.symbol && (
        <AddFundsModal
          fundsToAdd={bn(
            data.askForDeposit.minQuantity,
            data.askForDeposit.asset.decimals,
          ).mul(data.askForDeposit.asset.usdSpotPrice ?? 1)}
          variables={{
            symbol: data.askForDeposit.asset.symbol,
            chain: this.props.chain,
          }}
          onFundsAdded={onFundsAdded}
        />
      ),
    )
  }

  waitForBalance = async () => {
    const {
      data: { actionType },
      onEnd,
      open,
    } = this.props
    const { isWaiting } = this.state
    const { wallet } = this.context
    const accountKey = wallet.getActiveAccountKey()
    if (
      !(actionType === "WAIT_FOR_BALANCE" && open && !isWaiting && accountKey)
    ) {
      return
    }
    this.setState({ isWaiting: true })
    await Trader.pollBridgingEvents(accountKey.address)
    this.setState({ progress: 100 })
    onEnd()
  }

  getActionItems(): ActionItem {
    const { data } = this.props
    const { isFreezeMetadataChecked } = this.state
    const createOrder = {
      start: this.createOrder,
      title: "Sign message",
      content: "Sign a message using your wallet to continue.",
      buttonText: "Sign",
    }
    const swapChainName =
      CHAIN_IDENTIFIERS_TO_NAMES[
        data.askForSwap?.toAsset.assetContract.chain ?? "ETHEREUM"
      ]
    const fromAssetSymbol = data.askForSwap?.fromAsset.symbol
    const toAssetSymbol = data.askForSwap?.toAsset.symbol
    const isBridgeAction =
      !!data.askForSwap &&
      data.askForSwap.fromAsset.assetContract.chain !==
        data.askForSwap.toAsset.assetContract.chain
    const actionItems: Partial<Record<ActionTypes, ActionItem>> = {
      ASSET_FREEZE_METADATA: {
        start: this.freezeAssetMetadata,
        title: "Complete Freezing",
        content: (
          <>
            <Block marginRight="8px">
              <Checkbox
                checked={isFreezeMetadataChecked}
                onChange={isFreezeMetadataChecked =>
                  this.setState({ isFreezeMetadataChecked })
                }
              />
            </Block>
            <Block>
              I understand that by locking my metadata, my content is
              permanently stored in decentralized file storage (
              <Link href="https://ipfs.io/">IPFS</Link>) and cannot be edited
              nor removed. All of my content is exactly how it's intended to be
              presented.
            </Block>
          </>
        ),
        buttonText: "Submit transaction",
        isButtonDisabled: !isFreezeMetadataChecked,
      },
      ASSET_APPROVAL: {
        start: this.approve,
        title: "Unlock trading",
        content:
          "Submit a transaction with your wallet to unlock trading for this collection. This only needs to be done once.",
        buttonText: "Unlock",
      },
      PAYMENT_ASSET_APPROVAL: {
        start: this.approve,
        title: "Unlock currency",
        content:
          "Submit a transaction with your wallet to trade with this currency. This only needs to be done once.",
        buttonText: "Unlock",
      },
      FULFILL: {
        start: this.fulfill,
        title: "Finalize sale",
        content: "Follow your wallet’s instructions to finalize the sale.",
        buttonText: "Submit",
      },
      CANCEL_ORDER: {
        start: this.cancelOrder,
        title: "Cancel order",
        content: "Sign a message using your wallet to cancel your order.",
        buttonText: "Sign",
      },
      ASSET_TRANSFER: {
        start: this.transfer,
        title: "Transfer assets",
        content:
          "Follow your wallet's instructions to submit a transaction to transfer your assets",
        buttonText: "Transfer",
      },
      CREATE_ORDER: createOrder,
      ASSET_SWAP: {
        start: this.swap,
        title: "Convert tokens",
        content:
          "Submit a transaction with your wallet to convert your tokens.",
        buttonText: "Convert",
      },
      ASK_FOR_ASSET_SWAP: {
        start: this.askForSwap,
        title: isBridgeAction
          ? `Deposit ${fromAssetSymbol} into ${swapChainName}`
          : `Convert your ${fromAssetSymbol}`,
        content: isBridgeAction
          ? `Once you deposit ${fromAssetSymbol} into ${swapChainName}, you won’t need to pay a transaction fee again for future ${swapChainName} purchases with your deposited ${fromAssetSymbol}.`
          : `For compatibility, please convert your ${fromAssetSymbol} into wrapped ${fromAssetSymbol} (${toAssetSymbol}).`,
        buttonText: "Convert",
        symbol: fromAssetSymbol ?? "",
      },
      ASK_FOR_DEPOSIT: {
        start: this.onDepositAction,
        title: "Deposit or convert funds",
        content:
          "You don't have enough funds to complete the purchase. Please deposit or convert your funds.",
        buttonText: "Deposit",
      },
      WAIT_FOR_BALANCE: {
        title: "Wait for deposit",
        content:
          "Your deposit is pending and may take up to 45 minutes. You may leave this page or keep this modal open and check back later.",
      },
    }
    const actionItem = actionItems[data.actionType]
    if (!actionItem) {
      throw Error(`${data.actionType} isn't supported`)
    }
    return actionItem
  }

  getMinAmount() {
    const { data } = this.props
    const minAmount = data.askForSwap?.minQuantity
    const decimals = data.askForSwap?.fromAsset.decimals

    return minAmount ? bn(minAmount, decimals) : undefined
  }

  renderPanelContent() {
    const { data, open } = this.props
    if (!open) {
      return null
    }
    const { chain: walletChain } = this.context
    const actionType = data.actionType
    const { amount, amountValue, progress } = this.state
    const actionValues = this.getActionItems()
    const { start, content, buttonText, symbol, isButtonDisabled } =
      actionValues
    const chain =
      data?.transaction?.chainIdentifier ??
      data.askForSwap?.fromAsset.assetContract.chain
    const { metaTransaction } = readMetaTransaction(data)
    const multiChainActions: ActionTypes[] = [
      "ASK_FOR_DEPOSIT",
      "CREATE_ORDER",
      "CANCEL_ORDER",
    ]

    const isValidChain =
      multiChainActions.includes(actionType) ||
      chain === walletChain ||
      !!metaTransaction

    const maxAmount = data.askForSwap?.maxQuantity
    const decimals = data.askForSwap?.fromAsset.decimals

    return (
      <>
        <Text
          as="div"
          className="ActionPanel--text"
          margin="14px 0"
          variant="small"
        >
          {chain && !isValidChain ? (
            <>
              <Icon className="ActionPanel--text-icon" value="swap_horiz" />
              <span>
                Please switch your wallet's RPC to the{" "}
                {CHAIN_IDENTIFIERS_TO_NAMES[chain]} network.{" "}
                <Link href="/faq" target="_blank">
                  Learn how
                </Link>
              </span>
            </>
          ) : (
            content
          )}
        </Text>
        {isValidChain && actionType === "ASK_FOR_ASSET_SWAP" && symbol ? (
          <FrameConfiscator className="ActionPanel--input-frame">
            <NumericInput
              inputValue={amountValue}
              isRequired
              max={maxAmount ? bn(maxAmount, decimals) : undefined}
              maxDecimals={18}
              min={this.getMinAmount()}
              placeholder={this.tr("Amount")}
              value={amount}
              onChange={({ inputValue, value }) =>
                this.setState({ amount: value, amountValue: inputValue })
              }
            >
              {/* TODO: Use PaymentAsset */}
              <div className="ActionPanel--payment-asset-symbol">{symbol}</div>
            </NumericInput>
          </FrameConfiscator>
        ) : null}
        {buttonText ? (
          <ActionButton
            isDisabled={
              progress !== 0 ||
              !isValidChain ||
              (actionType === "ASK_FOR_ASSET_SWAP" && !amount) ||
              isButtonDisabled
            }
            type="primary"
            onClick={start}
          >
            {buttonText}
          </ActionButton>
        ) : null}
      </>
    )
  }

  render() {
    const {
      data: { actionType },
      step,
      open,
    } = this.props
    const { progress } = this.state
    const actionValues = this.getActionItems()
    const { title } = actionValues
    return (
      <DivContainer>
        <Panel
          bodyClassName="ActionPanel--content"
          headerClassName="ActionPanel--header"
          isContentPadded={false}
          key={`${open}`}
          mode={open ? "always-open" : "start-closed"}
          title={
            <>
              <ActionProgress
                progress={progress}
                showClock={actionType === "WAIT_FOR_BALANCE" && open}
                step={step}
              />
              <div className="ActionPanel--title">{title}</div>
            </>
          }
        >
          {open ? this.renderPanelContent() : null}
        </Panel>
      </DivContainer>
    )
  }
}

const ActionPanelSkeleton = () => (
  <Panel
    mode="always-open"
    title={
      <Skeleton>
        <Skeleton.Row alignItems="center">
          <Flex alignItems="center" width="100%">
            <Skeleton.Circle height="32px" width="32px" />
            <Block marginLeft="10px" width="50%">
              <Skeleton.Line />
            </Block>
          </Flex>
          <Skeleton.Circle height="20px" width="20px" />
        </Skeleton.Row>
      </Skeleton>
    }
  >
    <Skeleton>
      <Skeleton.Line />
      <Skeleton.Line />
      <Skeleton.Line width="50%" />
    </Skeleton>

    <Alert marginTop="14px" width="180px">
      <Skeleton>
        <Skeleton.Line />
      </Skeleton>
    </Alert>
  </Panel>
)

const ActionPanelBase = fragmentize(withMultiStepFlowContext(ActionPanel), {
  fragments: {
    data: graphql`
      fragment ActionPanel_data on ActionType {
        actionType
        askForDeposit {
          asset {
            assetContract {
              chain
            }
            decimals
            symbol
            usdSpotPrice
          }
          minQuantity
        }
        askForSwap {
          fromAsset {
            assetContract {
              chain
            }
            relayId
            decimals
            symbol
          }
          minQuantity
          maxQuantity
          toAsset {
            assetContract {
              chain
            }
            relayId
            symbol
          }
        }
        transaction {
          chainIdentifier
          ...trader_transaction
        }
        ...trader_sign_and_post
        ...trader_meta_transaction
      }
    `,
  },
})

export default Object.assign(ActionPanelBase, {
  Skeleton: ActionPanelSkeleton,
})

const DivContainer = styled.div`
  .ActionPanel--header {
    max-width: 600px;
    width: 100%;
    border-radius: 5px 5px 0px 0px;

    .ActionPanel--title {
      margin-left: 10px;
    }
  }

  .ActionPanel--content {
    padding: 0px 15px 15px;
    max-width: 600px;
    width: 100%;
  }

  .ActionPanel--text {
    display: flex;
  }

  .ActionPanel--text-icon {
    font-size: 24px;
    margin-right: 8px;
  }

  .ActionPanel--input-frame {
    margin-bottom: 12px;

    .ActionPanel--payment-asset-symbol {
      margin: 0 16px;
    }
  }
`
