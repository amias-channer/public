import React from "react"
import styled from "styled-components"
import { CHAIN_IDENTIFIERS_TO_NAMES } from "../../constants"
import Flex from "../../design-system/Flex"
import Item from "../../design-system/Item"
import { PaymentAsset_data } from "../../lib/graphql/__generated__/PaymentAsset_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { themeVariant } from "../../styles/styleUtils"

interface Props {
  className?: string
  data: PaymentAsset_data
  showChain?: boolean
}

const PaymentAsset = ({
  className,
  data: {
    asset: {
      imageUrl,
      symbol,
      assetContract: { chain },
    },
  },
  showChain,
}: Props) => {
  return (
    <Flex className={className}>
      {imageUrl ? (
        <AvatarContainer
          alignItems="center"
          lighten={symbol === "ETH" && chain === "ETHEREUM"}
        >
          <Item.Avatar src={imageUrl} />
        </AvatarContainer>
      ) : null}
      <Item.Content>
        <Item.Title>{symbol}</Item.Title>
        {showChain ? (
          <Item.Description>
            {CHAIN_IDENTIFIERS_TO_NAMES[chain]}
          </Item.Description>
        ) : null}
      </Item.Content>
    </Flex>
  )
}

const AvatarContainer = styled(Flex)<{ lighten: boolean }>`
  ${({ lighten }) =>
    lighten &&
    themeVariant({
      variants: {
        dark: {
          filter: "brightness(3)",
        },
      },
    })}
`

export default fragmentize(PaymentAsset, {
  fragments: {
    data: graphql`
      fragment PaymentAsset_data on PaymentAssetType {
        asset {
          assetContract {
            chain
          }
          imageUrl
          symbol
        }
      }
    `,
  },
})
