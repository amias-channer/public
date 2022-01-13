import React from "react"
import styled from "styled-components"
import { PriceHistoryStats_data } from "../../lib/graphql/__generated__/PriceHistoryStats_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { flatMap } from "../../lib/helpers/array"
import { bn, display } from "../../lib/helpers/numberUtils"
import { DayDurationFilter } from "./PriceHistoryDropdown.react"

interface Props {
  data: PriceHistoryStats_data
  dayDurationFilter: DayDurationFilter
  hideAllTimeVolume?: boolean
}

const PriceHistoryStats = ({
  data,
  dayDurationFilter,
  hideAllTimeVolume,
}: Props) => {
  const volumes = flatMap(data.results, ({ volume }) =>
    volume.quantity ? [bn(volume.quantity, volume.asset.decimals)] : [],
  )
  const quantities = data.results.map(({ quantity }) => bn(quantity, 0))
  if (!quantities.length) {
    return null
  }
  const quantityTotal = quantities.reduce((a, b) => a.plus(b))
  const volume = volumes.reduce((a, b) => a.plus(b))
  const priceAverage = volume.div(quantityTotal)
  return (
    <DivContainer>
      <div className="PriceHistoryStats--container">
        <div className="PriceHistoryStats--stat">
          <div>
            {dayDurationFilter === "All Time"
              ? "All Time Avg. Price"
              : dayDurationFilter === "365"
              ? "Yearlong Avg. Price"
              : `${dayDurationFilter} Day Avg. Price`}
          </div>
          <div className="PriceHistoryStats--value">
            {priceAverage ? `Ξ${display(priceAverage, "ETH")}` : "N/A"}
          </div>
        </div>
        {hideAllTimeVolume && dayDurationFilter === "All Time" ? null : (
          <div className="PriceHistoryStats--stat">
            <div>
              {dayDurationFilter === "All Time"
                ? "All Time Volume"
                : dayDurationFilter === "365"
                ? "Yearlong Volume"
                : `${dayDurationFilter} Day Volume`}
            </div>
            <div className="PriceHistoryStats--value">
              {volume ? `Ξ${display(volume, "ETH")}` : "N/A"}
            </div>
          </div>
        )}
      </div>
    </DivContainer>
  )
}

export default fragmentize(PriceHistoryStats, {
  fragments: {
    data: graphql`
      fragment PriceHistoryStats_data on TradeHistoryType {
        results {
          quantity
          volume {
            asset {
              assetContract {
                symbol
              }
              decimals
            }
            quantity
          }
        }
      }
    `,
  },
})

const DivContainer = styled.div`
  .PriceHistoryStats--container {
    display: flex;
    margin: 0 10px;
  }

  .PriceHistoryStats--stat {
    padding: 4px 10px;
  }

  .PriceHistoryStats--value {
    color: #3291e9;
    font-size: 17px;
    font-weight: 600;
  }
`
