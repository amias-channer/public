import React from "react"
import moment from "moment"
import styled from "styled-components"
import Block from "../../design-system/Block"
import Loader from "../../design-system/Loader/Loader.react"
import { PriceHistory_data } from "../../lib/graphql/__generated__/PriceHistory_data.graphql"
import { PriceHistoryQuery } from "../../lib/graphql/__generated__/PriceHistoryQuery.graphql"
import {
  graphql,
  GraphQLProps,
  refetchify,
  RefetchProps,
} from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import PriceHistoryDropdown, {
  DayDurationFilter,
} from "./PriceHistoryDropdown.react"
import PriceHistoryGraph from "./PriceHistoryGraph.react"
import PriceHistoryStats from "./PriceHistoryStats.react"

const DEFAULT_HEIGHT = 200

interface Props {
  hideAllTimeVolume?: boolean
  xMaxTickCount: number
  yMaxTickCount: number
  height?: number
  initialDayDurationFilter?: string
}

interface State {
  dayDurationFilter: DayDurationFilter
  loading: boolean
}

class PriceHistory extends GraphQLComponent<
  PriceHistoryQuery,
  Props & PriceHistoryRefetchProps & RefetchProps<PriceHistoryQuery>,
  State
> {
  static defaultProps = {
    height: DEFAULT_HEIGHT,
  }

  state: State = {
    dayDurationFilter: this.props.initialDayDurationFilter ?? "All Time",
    loading: false,
  }

  render() {
    const {
      data,
      hideAllTimeVolume,
      refetch,
      xMaxTickCount,
      yMaxTickCount,
      height,
      variables: { archetype, collection, bucketSize },
    } = this.props
    const { dayDurationFilter, loading } = this.state
    return (
      <DivContainer>
        <div className="PriceHistory--interface">
          <Block>
            <PriceHistoryDropdown
              dayDurationFilter={dayDurationFilter}
              onChange={async (newDayDurationFilter: DayDurationFilter) => {
                this.setState({
                  loading: true,
                  dayDurationFilter: newDayDurationFilter,
                })

                const newCutoff =
                  newDayDurationFilter !== "All Time"
                    ? moment().subtract(newDayDurationFilter, "days").format()
                    : undefined
                // If bucket size isn't set, the graph will auto-adjust based on how long of a history we're looking at.
                const newBucketSize =
                  bucketSize ??
                  (newDayDurationFilter === "All Time" ||
                  +newDayDurationFilter > 90
                    ? "WEEK"
                    : "DAY")

                await refetch({
                  archetype,
                  bucketSize: newBucketSize,
                  collection,
                  cutoff: newCutoff,
                })

                this.setState({
                  loading: false,
                })
              }}
            />
          </Block>
          {!loading && data?.tradeHistory ? (
            <PriceHistoryStats
              data={data?.tradeHistory}
              dayDurationFilter={dayDurationFilter}
              hideAllTimeVolume={hideAllTimeVolume}
            />
          ) : null}
        </div>
        {loading || !data?.tradeHistory ? (
          <div className="PriceHistory--loader">
            <Loader size="large" />
          </div>
        ) : (
          <div className="PriceHistory--graph">
            <PriceHistoryGraph
              data={data.tradeHistory}
              height={height || DEFAULT_HEIGHT}
              xMaxTickCount={xMaxTickCount}
              yMaxTickCount={yMaxTickCount}
            />
          </div>
        )}
      </DivContainer>
    )
  }
}

export const query = graphql`
  query PriceHistoryQuery(
    $archetype: ArchetypeInputType
    $bucketSize: BucketSize = "WEEK"
    $cutoff: DateTime
    $collection: CollectionSlug
  ) {
    ...PriceHistory_data
      @arguments(
        archetype: $archetype
        bucketSize: $bucketSize
        cutoff: $cutoff
        collection: $collection
      )
  }
`
interface PriceHistoryRefetchProps {
  data: PriceHistory_data | null
}

export default withData<PriceHistoryQuery, Props>(
  refetchify<
    PriceHistoryQuery,
    Props & PriceHistoryRefetchProps & GraphQLProps<PriceHistoryQuery>
  >(PriceHistory, {
    fragments: {
      data: graphql`
        fragment PriceHistory_data on Query
        @argumentDefinitions(
          archetype: { type: "ArchetypeInputType" }
          collection: { type: "CollectionSlug" }
          cutoff: { type: "DateTime" }
          bucketSize: { type: "BucketSize", defaultValue: WEEK }
        ) {
          tradeHistory(
            archetype: $archetype
            minTime: $cutoff
            collection: $collection
            bucketSize: $bucketSize
          ) {
            ...PriceHistoryStats_data
            ...PriceHistoryGraph_data
          }
        }
      `,
    },
    query,
  }),
  query,
)

const DivContainer = styled.div`
  .PriceHistory--interface {
    display: flex;
    flex-wrap: wrap;
  }

  .PriceHistory--loader {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    padding-top: 16px;
    width: 100%;
  }
`
