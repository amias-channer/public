import React from "react"
import { useFragment } from "react-relay"
import styled from "styled-components"
import Flex from "../../design-system/Flex"
import SpaceBetween from "../../design-system/SpaceBetween"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import { Price_data$key } from "../../lib/graphql/__generated__/Price_data.graphql"
import { SellFees_collection$key } from "../../lib/graphql/__generated__/SellFees_collection.graphql"
import { graphql } from "../../lib/graphql/graphql"
import {
  basisPointsToPercentage,
  BigNumber,
  bn,
} from "../../lib/helpers/numberUtils"
import Price from "../assets/Price.react"
import Icon from "../common/Icon.react"

interface Props {
  collectionDataKey: SellFees_collection$key | null
  priceDataKey: Price_data$key | null
  quantity: BigNumber
}

const SellFees = ({ collectionDataKey, priceDataKey, quantity }: Props) => {
  const collectionData = useFragment(
    graphql`
      fragment SellFees_collection on CollectionType {
        devSellerFeeBasisPoints
        openseaSellerFeeBasisPoints
      }
    `,
    collectionDataKey,
  )

  const devFee = collectionData?.devSellerFeeBasisPoints ?? 0
  const openseaFee = collectionData?.openseaSellerFeeBasisPoints ?? 0

  const quantityAfterFees = quantity.isNaN()
    ? bn(0)
    : quantity.times(bn(1).minus(bn(devFee + openseaFee, 4)))

  const renderRow = (title: string, basisPoints: number) =>
    basisPoints > 0 ? (
      <Flex margin="8px 0">
        <Text as="div">{title}</Text>
        <div className="SellFees--dotted-separator" />
        <Text as="div" marginLeft="20px">
          {basisPointsToPercentage(basisPoints)}%
        </Text>
      </Flex>
    ) : null

  return (
    <DivContainer>
      <Flex alignItems="center">
        <Text as="span" marginRight="4px" variant="bold">
          Fees
        </Text>
        {openseaFee > 0 ? (
          <Tooltip
            content={
              <>
                At OpenSea, we take {basisPointsToPercentage(openseaFee)}% from
                the price of a successful sale. The original creator of the item
                may also opt to take a fee on the final transaction as well.
              </>
            }
          >
            <Flex alignItems="center" className="SellFees--icon">
              <Icon size={20} value="info" variant="outlined" />
            </Flex>
          </Tooltip>
        ) : null}
      </Flex>

      {renderRow("OpenSea Fee", openseaFee)}
      {renderRow("Creator Royalty", devFee)}

      <hr className="SellFees--separator" />
      <SpaceBetween>
        <Text as="span" variant="bold">
          Total Earnings
        </Text>
        {priceDataKey ? (
          <Flex alignItems="flex-end" flexDirection="column">
            <Price
              className="SellFees--total-price"
              data={priceDataKey}
              quantity={quantityAfterFees}
            />
            <Price
              className="SellFees--total-price-fiat"
              data={priceDataKey}
              quantity={quantityAfterFees}
              secondary
              variant="fiat"
            />
          </Flex>
        ) : null}
      </SpaceBetween>
    </DivContainer>
  )
}

export default SellFees

const DivContainer = styled.div`
  .SellFees--separator {
    margin: 20px 0;
  }

  .SellFees--dotted-separator {
    flex-grow: 1;
    height: 16px;
    border-bottom: 1px dotted ${props => props.theme.colors.gray};
    margin: 0px 4px;
  }

  .SellFees--total-price {
    font-size: 18px;
    font-weight: 600;
  }

  .SellFees--total-price-fiat {
    font-size: 14px;
    color: ${props => props.theme.colors.text.subtle};
  }

  .SellFees--icon {
    color: ${props => props.theme.colors.text.subtle};
    cursor: pointer;

    &:hover {
      color: ${props => props.theme.colors.text.body};
    }
  }
`
