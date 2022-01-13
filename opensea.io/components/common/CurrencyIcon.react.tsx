import React from "react"
import styled from "styled-components"
import { NULL_ACCOUNT } from "../../constants"
import Tooltip from "../../design-system/Tooltip"
import { Token } from "../../reducers/tokens"

const SIMPLE_ETHER: Partial<Token> = {
  name: "Ether (ETH)",
  imageUrl:
    "https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg",
}

interface Props {
  token: Token
  shrink?: boolean
  shouldDefaultFiat?: boolean
  noSimpleEther?: boolean
  className?: string
}

export default class CurrencyIcon extends React.Component<Props> {
  static defaultProps = {
    className: "",
  }

  // Use the currency format for Ether above, instead of what's passed in
  getCurrency() {
    const { token, noSimpleEther } = this.props
    if (!noSimpleEther) {
      return token && token.address != null && token.address != NULL_ACCOUNT
        ? token
        : SIMPLE_ETHER
    }
    return token
  }

  render() {
    const { shouldDefaultFiat, className, ...props } = this.props
    if (shouldDefaultFiat) {
      return "$"
    }

    const currency = this.getCurrency()
    // const faqSectionName = currency.address ? 'tokens' : 'getting-started'
    // const linkPart =  `- <a href="/faq#${faqSectionName}" target="_blank" rel="noreferrer">Read more</a>`
    const linkPart = ""
    const tooltip = `${currency.name || currency.symbol}${linkPart}`

    return (
      <span className={className}>
        <Tooltip content={tooltip} delay={50} placement="top">
          {currency.imageUrl ? (
            <InlineImg
              src={currency.imageUrl}
              title={`${currency.name} (${currency.symbol})`}
              {...props}
            />
          ) : (
            <span title={currency.name}>{currency.symbol}</span>
          )}
        </Tooltip>
      </span>
    )
  }
}

const InlineImg = styled.img<Props>`
  max-height: ${props => (props.shrink ? "0.9em" : "1.2em")};
  max-width: ${props => (props.shrink ? "0.9em" : "1.2em")};
  margin-bottom: ${props => (props.shrink ? "-0.1em" : "-0.25em")};
  margin-right: 0.1em;
`
