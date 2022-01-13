import React from "react"
import memoizeOne from "memoize-one"
import moment from "moment"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import styled from "styled-components"
import AppComponent from "../../AppComponent.react"
import { NO_CHART_DATA_IMG } from "../../constants"
import { PriceHistoryGraph_data } from "../../lib/graphql/__generated__/PriceHistoryGraph_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { filter } from "../../lib/helpers/array"
import { fromISO8601 } from "../../lib/helpers/datetime"
import {
  BigNumber,
  bn,
  display,
  ETH_DECIMALS,
  normalizePriceDisplay,
} from "../../lib/helpers/numberUtils"
import { themeVariant } from "../../styles/styleUtils"
import THEMES from "../../styles/themes"
import { $blue, $primary_6 } from "../../styles/variables"
import Image from "../common/Image.react"

const ZOOM_LEVELS: Array<number> = [0.1, 0.2, 0.5, 1, 2, 5, 10]
const SECONDS_IN_DAY = 60 * 60 * 24

const timeFormat = (time: number) => moment.unix(time).format("MMM D, YYYY")

type Datum = {
  time: number
  timeEnd: number
  price: BigNumber
  volume: BigNumber
  quantity: BigNumber
}

interface Props {
  data: PriceHistoryGraph_data
  xMaxTickCount: number
  yMaxTickCount: number
  height: number
}

interface State {
  activePoint?: {
    x: number
    y: number
    payload: Datum
  }
}

class PriceHistoryGraph extends AppComponent<Props, State> {
  chart: HTMLDivElement | null = null
  line: Line | null = null
  state: State = {}

  getAggregatedData: (data: PriceHistoryGraph_data) => Datum[] = memoizeOne(
    data => {
      return filter(
        data.results.map(({ bucketStart, bucketEnd, quantity, volume }) => {
          const asset = volume.asset
          const time = fromISO8601(bucketStart).startOf("day").unix()
          const timeEnd = fromISO8601(bucketEnd).startOf("day").unix()
          const price = bn(volume.quantity, volume.asset.decimals).div(
            bn(quantity, 0),
          )
          return {
            time,
            timeEnd,
            price: price,
            volume: bn(volume.quantity, asset.decimals || ETH_DECIMALS),
            quantity: quantity,
          }
        }),
      )
    },
  )

  makeXTicks = memoizeOne((data: Datum[], xMaxTickCount: number): number[] => {
    if (xMaxTickCount < 2) {
      throw new Error("Tick count must be at least 2")
    }
    const times = data.map(d => d.time)
    if (times.length === 0) {
      return []
    }
    if (times.length === 1) {
      return [times[0]]
    }
    const start = moment.unix(Math.min(...times))
    const end = moment.unix(Math.max(...times))
    const days = end.diff(start, "day")
    const count = Math.min(xMaxTickCount, days + 1)
    const interval = Math.ceil(days / (count - 1))

    const returnData = Array(count)
      .fill(undefined)
      .map((_, i) =>
        end
          .clone()
          .subtract((count - i - 1) * interval, "day")
          .unix(),
      )
      .filter(t => t >= start.unix())
    return returnData
  })

  makeYTicks = memoizeOne(
    (data: BigNumber[], yMaxTickCount: number): number[] => {
      if (yMaxTickCount < 2) {
        throw new Error("Tick count must be at least 2")
      }
      if (data.length === 0) {
        return []
      }
      const minPrice = BigNumber.min(data)
      const maxPrice = BigNumber.max(data)
      const rangeMin = minPrice.equals(maxPrice) ? bn(0) : minPrice
      const rangeMax = minPrice.equals(maxPrice) ? maxPrice.times(2) : maxPrice
      const range = rangeMax.minus(rangeMin)
      const unit = bn(10).toPower(
        Math.floor(Math.log10(+range > 0 ? +range : 1)),
      )
      const zooms = ZOOM_LEVELS.map(interval => ({
        interval,
        min: +rangeMin.div(unit).div(interval).floor(),
        max: +rangeMax.div(unit).div(interval).ceil(),
      }))
      const { interval, min, max } =
        zooms.find(({ min, max }) => yMaxTickCount - 1 >= max - min) ||
        zooms[zooms.length - 1]
      const count = Math.min(yMaxTickCount, Math.ceil(max - min) + 1)
      return Array(count)
        .fill(undefined)
        .map(
          (_, i) =>
            +unit.times(interval.toString()).times((min + i).toString()),
        )
    },
  )

  render() {
    const { data: rawData, xMaxTickCount, yMaxTickCount, height } = this.props
    const { activePoint } = this.state

    const data = this.getAggregatedData(rawData)
    if (data.length === 0) {
      return (
        <DivContainer className="PriceHistory--empty">
          <Image
            className="PriceHistory--no-data-img"
            height={100}
            url={NO_CHART_DATA_IMG}
          />
          <div className="PriceHistory--no-data-text">No trading data yet</div>
        </DivContainer>
      )
    }

    const xTicks = this.makeXTicks(data, xMaxTickCount)
    const yTicksPrice = this.makeYTicks(
      data.map(d => d.price),
      yMaxTickCount,
    )
    const chartBox = this.chart?.getBoundingClientRect()
    const symbol = rawData.results[0]?.volume.asset.assetContract.symbol
    const colors = THEMES[this.context.theme].colors
    const stroke = colors.border
    const fill = colors.text.body

    return (
      <DivContainer
        ref={ref => {
          this.chart = ref
        }}
        style={{ height: height + "px" }}
      >
        <ResponsiveContainer
          className="PriceHistory--chart"
          height={height - 70}
          width="100%"
        >
          <ComposedChart
            data={data.map(({ time, timeEnd, price, volume, quantity }) => ({
              time,
              timeEnd,
              price: +price,
              volume: +volume,
              quantity: +quantity,
            }))}
            margin={{ bottom: 0, left: 0, right: 0, top: 5 }}
            onMouseLeave={() => this.setState({ activePoint: undefined })}
            onMouseMove={chart => {
              const points = this.line?.props?.points
              if (points) {
                // @ts-expect-error okay
                const newActivePoint = points[
                  chart?.activeTooltipIndex
                ] as State["activePoint"]
                if (
                  newActivePoint?.x !== activePoint?.x ||
                  newActivePoint?.y !== activePoint?.y
                ) {
                  this.setState({
                    activePoint: newActivePoint,
                  })
                }
              }
            }}
          >
            <CartesianGrid stroke={stroke} vertical={false} />
            <XAxis
              dataKey="time"
              domain={[data[0].time, data[data.length - 1].time]}
              interval={0}
              stroke={stroke}
              tick={{
                fill,
                fillOpacity: 0.6,
              }}
              tickFormatter={time => moment.unix(time).format("M/D")}
              tickMargin={6}
              tickSize={10}
              ticks={xTicks}
              type="number"
            />
            <YAxis
              dataKey="price"
              domain={[yTicksPrice[0], yTicksPrice[yTicksPrice.length - 1]]}
              interval={0}
              padding={{ bottom: 0, top: 10 }}
              stroke={stroke}
              tick={{
                fill,
                fillOpacity: 0.6,
              }}
              tickMargin={18}
              tickSize={10}
              ticks={yTicksPrice}
              type="number"
              width={53}
              yAxisId="left"
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              dataKey="volume"
              interval={0}
              orientation="right"
              padding={{ bottom: 0, top: 40 }}
              tick={false}
              tickCount={3}
              tickSize={10}
              type="number"
              width={15}
              yAxisId="right"
            />
            <Bar barSize={5} dataKey="volume" fill="#bfdcf6" yAxisId="right" />
            <Line
              activeDot={{
                fill: $blue,
                stroke: $blue,
                strokeOpacity: 0.3,
                strokeWidth: 5,
              }}
              dataKey="price"
              dot={false}
              isAnimationActive={false}
              ref={ref => {
                this.line = ref
              }}
              stroke={$blue}
              strokeWidth={3}
              type="monotone"
              yAxisId="left"
            />
          </ComposedChart>
        </ResponsiveContainer>
        {activePoint && chartBox ? (
          <div
            className="PriceHistory--tooltip-container"
            style={{
              left: chartBox.left + pageXOffset + activePoint.x,
              top: chartBox.top + pageYOffset + activePoint.y,
            }}
          >
            <div className="PriceHistory--tooltip">
              <div className="PriceHistory--tooltip-bubble" />
              <div className="PriceHistory--tooltip-time">
                {
                  // TODO: accommodate buckets other than weeks and days.
                  activePoint.payload.timeEnd - activePoint.payload.time <=
                  SECONDS_IN_DAY
                    ? timeFormat(activePoint.payload.time)
                    : `Week of ${timeFormat(activePoint.payload.time)}`
                }
              </div>
              <div className="PriceHistory--tooltip-price">
                Avg. price: Ξ{display(activePoint.payload.price, symbol)}
              </div>
              <div className="PriceHistory--tooltip-volume">
                Volume: Ξ{normalizePriceDisplay(activePoint.payload.volume)}
              </div>
              <div className="PriceHistory--tooltip-volume">
                Num. sales: {display(activePoint.payload.quantity)}
              </div>
            </div>
          </div>
        ) : null}
      </DivContainer>
    )
  }
}

export default fragmentize(PriceHistoryGraph, {
  fragments: {
    data: graphql`
      fragment PriceHistoryGraph_data on TradeHistoryType {
        results {
          bucketStart
          bucketEnd
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
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 300px;
  justify-content: center;
  user-select: none;

  &.PriceHistory--empty {
    height: initial;
    margin-bottom: 16px;
  }

  .PriceHistory--no-data-img {
    ${themeVariant({
      variants: {
        dark: {
          opacity: 0.5,
        },
      },
    })}
  }

  .PriceHistory--no-data-text {
    font-size: 16px;
    margin-top: 4px;
  }

  .PriceHistory--loader {
    display: flex;
    justify-content: center;
  }

  .PriceHistory--chart {
    color: grey;
    font-size: 12px;
    font-weight: 500;
    margin: 12px 0 8px;

    .recharts-cartesian-grid-horizontal line:last-child {
      display: none;
    }
  }

  .PriceHistory--tooltip-container {
    margin: -70px 0 0 -80px;
    position: absolute;
    transition: left 400ms ease 0s;
    transition: top 400ms ease 0s;

    .PriceHistory--tooltip {
      align-items: center;
      background-color: ${$primary_6};
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      height: fit-content;
      justify-content: center;
      position: relative;
      padding: 8px;
      width: 160px;

      .PriceHistory--tooltip-bubble {
        background-color: inherit;
        border-radius: inherit;
        bottom: -5px;
        clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
        height: 20px;
        left: calc(50% - 10);
        position: absolute;
        transform: rotate(-45deg);
        width: 20px;
      }

      .PriceHistory--tooltip-time {
        color: white;
        font-size: 10px;
        font-weight: 500;
      }

      .PriceHistory--tooltip-price {
        color: ${$blue};
        font-size: 14px;
        font-weight: 500;
      }

      .PriceHistory--tooltip-volume {
        color: ${$blue};
        font-size: 14px;
      }
    }
  }
`
