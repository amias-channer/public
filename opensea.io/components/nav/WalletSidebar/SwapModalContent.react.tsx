import React, { useState } from "react"
import { noop } from "lodash"
import { useLazyLoadQuery } from "react-relay"
import styled from "styled-components"
import { CHAIN_IDENTIFIERS_TO_NAMES } from "../../../constants"
import Dropdown from "../../../design-system/Dropdown"
import Flex from "../../../design-system/Flex"
import FlexEnd from "../../../design-system/FlexEnd"
import Loader from "../../../design-system/Loader/Loader.react"
import Modal from "../../../design-system/Modal"
import { useMultiStepFlowContext } from "../../../design-system/Modal/MultiStepFlow.react"
import Text from "../../../design-system/Text"
import Tooltip from "../../../design-system/Tooltip"
import useAppContext from "../../../hooks/useAppContext"
import useToasts from "../../../hooks/useToasts"
import { useTransactionProgress } from "../../../hooks/useTransactionProgress"
import { useTranslations } from "../../../hooks/useTranslations"
import Trader from "../../../lib/chain/trader"
import { SwapModalContentFromQuery } from "../../../lib/graphql/__generated__/SwapModalContentFromQuery.graphql"
import { SwapModalContentToQuery } from "../../../lib/graphql/__generated__/SwapModalContentToQuery.graphql"
import { graphql } from "../../../lib/graphql/graphql"
import { bn } from "../../../lib/helpers/numberUtils"
import { querySwapActions } from "../../../lib/helpers/swap"
import { UnreachableCaseError } from "../../../lib/helpers/type"
import ActionButton from "../../common/ActionButton.react"
import BalanceLabel from "../../common/BalanceLabel.react"
import FundItem from "../../common/FundItem"
import Icon from "../../common/Icon.react"
import NumericInput from "../../forms/NumericInput.react"
import ActionPanelList from "../../orders/ActionPanelList.react"
import { SwapIdentifier } from "./types"

interface Props {
  from: SwapIdentifier
  to: SwapIdentifier
  onViewWallet: () => unknown
  onSuccess: () => unknown
}

export const SwapModalContent = ({
  from: initialFrom,
  to: initialTo,
  onViewWallet,
  onSuccess,
}: Props) => {
  const [value, setValue] = useState<string | undefined>("")
  const [amount, setAmount] = useState("")
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  const { progress, waitForTransaction } = useTransactionProgress()
  const { onPrevious, onNext } = useMultiStepFlowContext()
  const step =
    progress >= 100 ? "success" : progress > 0 ? "processing" : "input"

  const { wallet } = useAppContext()
  const { tr } = useTranslations()
  const { attempt, showSuccessMessage } = useToasts()
  const address = wallet?.activeAccount?.address ?? ""

  const isMaticReverseSwap =
    from.chain.identifier === "MUMBAI" || from.chain.identifier === "MATIC"

  const renderFundItem = ({
    fund,
    reverseFund,
    setFund,
  }: {
    fund: typeof fromFund
    reverseFund: typeof toFund
    setFund: typeof setFrom
  }) => {
    const { supportedSwaps } = reverseFund
    const hasMultipleSwaps = supportedSwaps.length > 1

    return hasMultipleSwaps ? (
      <Dropdown
        items={supportedSwaps}
        renderItem={({ Item, item, close }) => (
          <Item
            onClick={() => {
              setFund(item)
              close()
            }}
          >
            <Item.Content>
              <Item.Title>{item.symbol}</Item.Title>
              <Item.Description>
                {CHAIN_IDENTIFIERS_TO_NAMES[item.chain.identifier]}
              </Item.Description>
            </Item.Content>
          </Item>
        )}
      >
        <FundItem
          actions={
            <Icon
              className="WrapUnwrapModalContent--icon"
              value="expand_more"
            />
          }
          chain={fund.chain}
          className="WrapUnwrapModalContent--fund-item"
          image={fund.image}
          name={fund.name}
          symbol={fund.symbol}
          onClick={noop}
        />
      </Dropdown>
    ) : (
      <FundItem
        chain={fund.chain}
        className="WrapUnwrapModalContent--fund-item"
        image={fund.image}
        name={fund.name}
        symbol={fund.symbol}
      />
    )
  }

  const {
    wallet: { fundsOf: fromFund },
    paymentAsset: fromPaymentAsset,
  } = useLazyLoadQuery<SwapModalContentFromQuery>(
    graphql`
      query SwapModalContentFromQuery(
        $address: AddressScalar!
        $symbol: String!
        $chain: ChainScalar!
      ) {
        paymentAsset(symbol: $symbol, chain: $chain) {
          asset {
            relayId
            decimals
          }
        }
        wallet(address: $address) {
          fundsOf(symbol: $symbol, chain: $chain) {
            name
            symbol
            chain
            quantity
            image
            usdPrice
            supportedSwaps {
              symbol
              chain {
                identifier
              }
            }
          }
        }
      }
    `,
    { chain: from.chain.identifier, symbol: from.symbol, address },
  )

  const {
    wallet: { fundsOf: toFund },
    paymentAsset: toPaymentAsset,
  } = useLazyLoadQuery<SwapModalContentToQuery>(
    graphql`
      query SwapModalContentToQuery(
        $address: AddressScalar!
        $symbol: String!
        $chain: ChainScalar!
      ) {
        paymentAsset(symbol: $symbol, chain: $chain) {
          asset {
            relayId
            decimals
          }
        }
        wallet(address: $address) {
          fundsOf(symbol: $symbol, chain: $chain) {
            name
            symbol
            chain
            quantity
            image
            usdPrice
            supportedSwaps {
              symbol
              chain {
                identifier
              }
            }
          }
        }
      }
    `,
    { chain: to.chain.identifier, symbol: to.symbol, address },
  )

  const swapFromTo = () => {
    setFrom(to)
    setTo(from)
  }

  const swap = async () => {
    if (isMaticReverseSwap) {
      window.open("https://wallet.matic.network/")
      return
    }

    const provider = await wallet.getProvider
    if (!provider) {
      onViewWallet()
      return
    }

    await attempt(async () => {
      const swapActions = await querySwapActions({
        amount,
        fromAsset: fromPaymentAsset.asset.relayId,
        toAsset: toPaymentAsset.asset.relayId,
      })

      if (swapActions.actions.length === 1) {
        const [action] = swapActions.actions
        const hash = await Trader.swap(action)
        await waitForTransaction({
          hash,
          chain: from.chain.identifier,
          onSuccess: () => {
            onSuccess()
            showSuccessMessage("Transaction successful!")
          },
        })
        return
      }

      onNext(() => (
        <>
          <Modal.Header onPrevious={onPrevious}>
            <Modal.Title>Convert tokens</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ActionPanelList data={swapActions} onEnd={onSuccess} />
          </Modal.Body>
        </>
      ))
    })
  }

  const renderContent = () => {
    switch (step) {
      case "processing":
      case "input": {
        return (
          <>
            {step === "processing" ? (
              <>
                <StyledBody>
                  <Flex justifyContent="center">
                    <Loader />
                  </Flex>
                  <Text textAlign="center" variant="bold">
                    Processing...
                  </Text>
                  <Text textAlign="center">
                    Your {to.symbol} will be added to your account once the
                    transaction is processed.
                  </Text>
                </StyledBody>
              </>
            ) : (
              <>
                <StyledBody>
                  <div className="WrapUnwrapModalContent--input-container">
                    <BalanceLabel
                      label="From"
                      quantity={fromFund.quantity}
                      symbol={fromFund.symbol}
                      usdPrice={fromFund.usdPrice!}
                    />
                    <NumericInput
                      autoFocus
                      inputClassName="WrapUnwrapModalContent--input"
                      inputValue={amount}
                      isRequired
                      max={bn(fromFund.quantity)}
                      maxDecimals={fromPaymentAsset.asset.decimals ?? undefined}
                      placeholder={tr("Amount")}
                      value={value}
                      onChange={({ inputValue, value }) => {
                        setAmount(inputValue)
                        setValue(value)
                      }}
                    >
                      {renderFundItem({
                        fund: fromFund,
                        reverseFund: toFund,
                        setFund: setFrom,
                      })}
                    </NumericInput>
                  </div>
                  <FlexEnd className="WrapUnwrapModalContent--swap-icon-container">
                    <Tooltip content={tr("Swap")}>
                      <Icon
                        aria-label="Swap"
                        className="WrapUnwrapModalContent--icon"
                        value="swap_vertical_circle"
                        variant="outlined"
                        onClick={swapFromTo}
                      />
                    </Tooltip>
                  </FlexEnd>
                  <div className="WrapUnwrapModalContent--input-container">
                    <BalanceLabel
                      label="To"
                      quantity={toFund.quantity}
                      symbol={toFund.symbol}
                      usdPrice={toFund.usdPrice!}
                    />
                    <NumericInput
                      disabled
                      inputClassName="WrapUnwrapModalContent--input"
                      inputValue={amount}
                      isRequired
                      max={bn(fromFund.quantity)}
                      maxDecimals={fromPaymentAsset.asset.decimals ?? undefined}
                      placeholder={tr("Amount")}
                      value={value}
                      onChange={noop}
                    >
                      {renderFundItem({
                        fund: toFund,
                        reverseFund: fromFund,
                        setFund: setTo,
                      })}
                    </NumericInput>
                  </div>
                </StyledBody>
              </>
            )}

            <Modal.Footer>
              <ActionButton
                isDisabled={
                  !isMaticReverseSwap &&
                  (!amount ||
                    amount === "0" ||
                    bn(amount).greaterThan(fromFund.quantity))
                }
                onClick={swap}
              >
                {tr("Convert tokens")}
              </ActionButton>
            </Modal.Footer>
          </>
        )
      }
      case "success":
        return (
          <>
            <StyledBody>
              <Flex justifyContent="center">
                <Icon color="success" size={48} value="check_circle_outline" />
              </Flex>
              <Text textAlign="center" variant="bold">
                Transaction Complete!
              </Text>
              <Text textAlign="center">
                Your {amount} {to.symbol} has been added to your account and
                will appear in your wallet shortly.
              </Text>
            </StyledBody>
            <Modal.Footer>
              <ActionButton onClick={onViewWallet}>
                {tr("View Wallet")}
              </ActionButton>
            </Modal.Footer>
          </>
        )
      default:
        throw new UnreachableCaseError(step)
    }
  }

  return (
    <>
      <Modal.Header>
        <Modal.Title>{tr("Convert tokens")}</Modal.Title>
      </Modal.Header>
      {renderContent()}
    </>
  )
}

const StyledBody = styled(Modal.Body)`
  .WrapUnwrapModalContent--fund-item {
    border: none;
    width: 180px;
  }

  .WrapUnwrapModalContent--icon {
    color: ${props => props.theme.colors.withOpacity.text.heading.medium};

    :hover {
      color: ${props => props.theme.colors.text.heading};
    }
  }

  .WrapUnwrapModalContent--swap-icon-container {
    margin: 20px 0;
  }

  .WrapUnwrapModalContent--input-container {
    height: 132px;
  }

  .Input--main {
    .WrapUnwrapModalContent--input {
      height: auto;
    }
  }
`

export default SwapModalContent
