import React from "react"
import _ from "lodash"
import styled from "styled-components"
import TokenActions from "../../actions/tokens"
import { MAX_TOKEN_INPUT_VALUE } from "../../constants"
import Dropdown from "../../design-system/Dropdown"
import { bn, getMaxDecimals } from "../../lib/helpers/numberUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import { Tokens } from "../../reducers/tokenlist"
import { Token } from "../../reducers/tokens"
import { dispatch, getState, subscribe } from "../../store"
import CurrencyIcon from "../common/CurrencyIcon.react"
import Icon from "../common/Icon.react"
import NumericInput from "./NumericInput.react"

type Props = {
  disableEth?: boolean
  disableWeth?: boolean
  onlyWithUsd?: boolean
  onChange?: (value: string) => void
  onTokenChange?: (value: Token) => void // If undefined, disable changes
  token: Token
  value: string
} & Pick<
  React.ComponentProps<typeof NumericInput>,
  "className" | "disabled" | "placeholder"
>

interface State {
  tokens: Tokens
}

export default class PaymentTokenInput extends React.Component<Props, State> {
  static defaultProps = {
    placeholder: "",
    className: "",
  }

  state: State = {
    tokens: getState().tokens,
  }

  unsub?: () => void

  async componentDidMount() {
    this.unsub = subscribe(() => this._onChange())
    await dispatch(TokenActions.findAll())
  }

  _onChange() {
    const { tokens } = getState()
    this.setState({ tokens })
  }

  componentWillUnmount() {
    if (this.unsub) {
      this.unsub()
    }
  }

  setToken = async (newToken: Token) => {
    const { onChange } = this.props
    const currentToken = this.props.token
    if (newToken.symbol !== currentToken.symbol && onChange) {
      onChange("")
    }
    if (this.props.onTokenChange) {
      this.props.onTokenChange(newToken)
    }
  }

  getFilteredTokens() {
    const { disableWeth, disableEth, onlyWithUsd } = this.props
    const { asset, bundle } = getState()
    const { tokens } = this.state
    const collection = asset.collection ? asset.collection : bundle.collection

    const allowedTokens: Token[] =
      collection?.paymentTokens && !bundle.creating
        ? collection.paymentTokens
        : tokens.tokens

    return _(allowedTokens)
      .filter(t => {
        if (disableWeth && t.symbol === "WETH") {
          return false
        }
        if (disableEth && t.symbol === "ETH") {
          return false
        }
        if (onlyWithUsd && !t.usdPrice) {
          return false
        }
        return true
      })
      .sortBy(t => t.symbol)
      .sortBy(t => !["WETH", "ETH"].includes(t.symbol))
      .value()
  }

  render() {
    const { className, disabled, onTokenChange, onChange, placeholder, value } =
      this.props

    const currentToken = this.props.token
    const filteredTokens = this.getFilteredTokens()
    const hasOtherOptions = filteredTokens.length > 1
    const enableDropdown = (!!onTokenChange && hasOtherOptions) || !disabled

    return (
      <DivContainer
        className={`${className} ${selectClassNames("PaymentTokenInput", {
          disabled: !enableDropdown,
        })}`}
      >
        <NumericInput
          disabled={disabled}
          inputValue={value}
          max={bn(MAX_TOKEN_INPUT_VALUE)}
          maxDecimals={getMaxDecimals(currentToken.symbol)}
          placeholder={placeholder}
          value={value}
          onChange={({ value }) => {
            if (value !== undefined && onChange) {
              onChange(value)
            }
          }}
        >
          <Dropdown
            disabled={!enableDropdown}
            items={filteredTokens}
            renderItem={({ Item, item, close }) => (
              <Item
                key={item.symbol}
                onClick={() => {
                  this.setToken(item)
                  close()
                }}
              >
                <Item.Avatar backgroundColor="white" borderRadius="50%">
                  <CurrencyIcon token={item} />
                </Item.Avatar>
                <Item.Content>
                  <Item.Title>{item.symbol}</Item.Title>
                </Item.Content>
              </Item>
            )}
          >
            <div className="PaymentTokenInput--selector">
              <div className="PaymentTokenInput--selected-token">
                <CurrencyIcon token={currentToken} />
                {enableDropdown ? (
                  <Icon
                    className="PaymentTokenInput--selector-icon"
                    title="Open Dropdown"
                    value="expand_more"
                  />
                ) : null}
              </div>
            </div>
          </Dropdown>
        </NumericInput>
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  &.PaymentTokenInput--disabled {
    .PaymentTokenInput--selector {
      cursor: default;
      pointer-events: none;
      .PaymentTokenInput--selector-icon {
        opacity: 0;
      }
    }
  }

  .PaymentTokenInput--selector {
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin: 0 4px;
    width: 72px;

    .PaymentTokenInput--selected-token {
      align-items: center;
      display: flex;
      flex: 1 0;
      font-size: 22px;
      justify-content: center;
    }

    .PaymentTokenInput--selector-icon {
      font-size: 24px;
    }
  }
`
