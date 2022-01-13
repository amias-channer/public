import React from "react"
import { useFragment } from "react-relay"
import styled from "styled-components"
import Text from "../../design-system/Text"
import { useTranslations } from "../../hooks/useTranslations"
import { PaymentTokenInputV2_data$key } from "../../lib/graphql/__generated__/PaymentTokenInputV2_data.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { bn, displayUSD } from "../../lib/helpers/numberUtils"
import { sortBySymbol } from "../../lib/helpers/paymentAssets"
import PaymentAsset from "../common/PaymentAsset.react"
import NumericInput from "../forms/NumericInput.react"
import Dropdown from "../v2/Dropdown.react"

interface Props {
  dataKey: PaymentTokenInputV2_data$key
  price: string
  onChange: ({
    paymentAssetRelayId,
    price,
  }: {
    paymentAssetRelayId: string
    price: string
  }) => unknown
  paymentAssetRelayId: string
  showSinglePaymentAsset?: boolean
  onBlur?: () => unknown
}

const PaymentTokenInputV2 = ({
  dataKey,
  price,
  paymentAssetRelayId,
  onChange,
  showSinglePaymentAsset,
  onBlur,
}: Props) => {
  const { tr } = useTranslations()
  const paymentAssets = useFragment(
    graphql`
      fragment PaymentTokenInputV2_data on PaymentAssetType
      @relay(plural: true) {
        relayId
        asset {
          decimals
          symbol
          usdSpotPrice
        }
        ...PaymentAsset_data
      }
    `,
    dataKey,
  )

  const paymentAsset = paymentAssets.find(
    paymentAsset => paymentAsset.relayId === paymentAssetRelayId,
  )
  const usdSpotPrice = paymentAsset?.asset.usdSpotPrice

  return (
    <DivContainer>
      <NumericInput
        inputValue={price?.toString() ?? ""}
        isRequired
        maxDecimals={paymentAsset?.asset.decimals ?? 0}
        placeholder={tr("Amount")}
        right={
          <Text
            as="div"
            className="PaymentTokenInputV2--price-display PaymentTokenInputV2--input-right"
            textAlign="right"
            variant="small"
          >
            {usdSpotPrice && price
              ? `$${displayUSD(bn(price).mul(usdSpotPrice))}`
              : "$0.00"}
          </Text>
        }
        value={price?.toString() ?? ""}
        onBlur={onBlur}
        onChange={({ value }) =>
          value !== undefined && onChange({ paymentAssetRelayId, price: value })
        }
      >
        {(showSinglePaymentAsset || paymentAssets.length === 1) &&
        paymentAsset ? (
          <PaymentAsset
            className="PaymentTokenInputV2--payment-asset PaymentTokenInputV2--input-left"
            data={paymentAsset}
          />
        ) : (
          <Dropdown
            className="PaymentTokenInputV2--input-left"
            getKey={paymentAsset => paymentAsset.relayId}
            header={paymentAsset ? <PaymentAsset data={paymentAsset} /> : null}
            isClosedOnSelect
            items={sortBySymbol(
              Array.from(paymentAssets?.filter(p => p !== paymentAsset) ?? []),
              p => p.asset.symbol ?? "",
            )}
            render={paymentAsset => <PaymentAsset data={paymentAsset} />}
            showAllOptions
            onItemClick={paymentAsset =>
              onChange({ paymentAssetRelayId: paymentAsset.relayId, price })
            }
          />
        )}
      </NumericInput>
    </DivContainer>
  )
}

export default PaymentTokenInputV2

const DivContainer = styled.div`
  .PaymentTokenInputV2--payment-asset,
  .PaymentTokenInputV2--price-display {
    padding: 0 12px;
  }

  .PaymentTokenInputV2--price-display {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .PaymentTokenInputV2--input-left {
    min-width: 150px;
  }

  .PaymentTokenInputV2--input-right {
    width: 100px;
  }
`
