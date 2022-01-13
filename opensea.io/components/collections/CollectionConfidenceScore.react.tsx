import React from "react"
import moment from "moment"
import { useFragment } from "react-relay"
import styled, { css } from "styled-components"
import Block from "../../design-system/Block"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import { CollectionConfidenceScore_data$key } from "../../lib/graphql/__generated__/CollectionConfidenceScore_data.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { bn } from "../../lib/helpers/numberUtils"
import { keys } from "../../lib/helpers/object"
import Icon from "../common/Icon.react"
import { sizeMQ } from "../common/MediaQuery.react"

enum DataPoints {
  TOTAL_SALES = "totalSales",
  TOTAL_VOLUME = "totalVolume",
  OWNER_AGE_IN_MONTHS = "ownerAgeInMonths",
  COLLECTION_AGE_IN_MONTHS = "collectionAgeInMonths",
  NUM_VISITORS = "numVisitors",
  FAVORITES_COUNT = "favoritesCount",
  IRREGULAR_COLLECTION_NAME = "irregularCollectionName",
  TOTAL_SUPPLY = "totalSupply",
  IS_VERIFIED = "isVerified",
}

type WeightScore = {
  threshold: number
  points: number
}

type WeightDefinitionProps = {
  [key in DataPoints]: Array<WeightScore>
}

type Props = {
  dataKey: CollectionConfidenceScore_data$key
}

type ScoreData = {
  [key in DataPoints]: number
}

type BarColors = "error" | "warning" | "seaGrass"

const METRIC_WEIGHTS: WeightDefinitionProps = {
  totalSales: [
    {
      threshold: 5,
      points: 10,
    },
  ],
  totalVolume: [
    {
      threshold: 1,
      points: 10,
    },
    {
      threshold: 10,
      points: 10,
    },
  ],
  ownerAgeInMonths: [
    {
      threshold: 1,
      points: 5,
    },
    {
      threshold: 3,
      points: 5,
    },
  ],
  collectionAgeInMonths: [
    {
      threshold: 1,
      points: 10,
    },
    {
      threshold: 3,
      points: 10,
    },
  ],
  numVisitors: [
    {
      threshold: 100,
      points: 10,
    },
  ],
  favoritesCount: [
    {
      threshold: 10,
      points: 10,
    },
  ],
  irregularCollectionName: [
    {
      threshold: 1,
      points: -30,
    },
  ],
  totalSupply: [
    {
      threshold: 1_000_000,
      points: -20,
    },
  ],
  isVerified: [
    {
      threshold: 1,
      points: 80,
    },
  ],
}

const MINIMUM_SCORE = 5

const calculateConfidenceScore = (data: ScoreData) => {
  let score = MINIMUM_SCORE

  keys(METRIC_WEIGHTS).map(dataKey => {
    const value = data[dataKey as DataPoints]
    const weightedPoints = METRIC_WEIGHTS[dataKey as DataPoints]

    score = weightedPoints.reduce(
      (currentScore, weight) =>
        bn(value).greaterThanOrEqualTo(weight.threshold)
          ? currentScore + weight.points
          : currentScore,
      score,
    )
  })

  score = Math.min(Math.max(score, MINIMUM_SCORE), 85)

  return score
}

const CollectionConfidenceScore = ({ dataKey }: Props) => {
  const { numVisitors, favoritesCount, collection } = useFragment(
    graphql`
      fragment CollectionConfidenceScore_data on AssetType {
        numVisitors
        favoritesCount
        collection {
          name
          createdDate
          owner {
            config
            createdDate
          }
          stats {
            totalVolume
            totalSales
            totalSupply
          }
        }
      }
    `,
    dataKey,
  )

  const score = calculateConfidenceScore({
    numVisitors,
    favoritesCount,
    totalSales: collection.stats.totalSales,
    totalVolume: collection.stats.totalVolume,
    collectionAgeInMonths: moment().diff(
      moment.utc(collection.createdDate),
      "months",
    ),
    ownerAgeInMonths: collection.owner
      ? moment().diff(moment.utc(collection.owner.createdDate), "months")
      : 0,
    irregularCollectionName: /( {2})|[-_~|]/.test(collection.name) ? 1 : 0,
    totalSupply: collection.stats.totalSupply,
    isVerified: collection.owner?.config === "VERIFIED" ? 1 : 0,
  })

  let fillColor: BarColors = "error"

  if (score >= 50) {
    fillColor = "seaGrass"
  } else if (score >= 33 && score < 50) {
    fillColor = "warning"
  }

  return (
    <DivContainer>
      <div className="CollectionConfidenceScore--text">
        <Text marginRight="8px" variant="bold">
          OpenSea Confidence Score
        </Text>
        <Tooltip
          content={
            <>
              Based on the data we have, we provide a confidence score on
              collections and users to prevent fraud.
            </>
          }
        >
          <Icon color="gray" cursor="pointer" value="info" variant="outlined" />
        </Tooltip>
      </div>
      <div className="CollectionConfidenceScore--bar">
        <StyledScoreBar
          fillColor={fillColor}
          height="100%"
          width={`${score}%`}
        />
      </div>
    </DivContainer>
  )
}

const DivContainer = styled.div`
  padding: 0 24px 24px;

  .CollectionConfidenceScore--bar {
    background-color: ${props => props.theme.colors.border};
    border-radius: 10px;
    height: 10px;
    width: 100%;
    overflow: hidden;
  }

  .CollectionConfidenceScore--text {
    width: 100%;
    display: flex;
    align-items: center;
  }

  ${sizeMQ({
    tabletS: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0;

      .CollectionConfidenceScore--bar,
      .CollectionConfidenceScore--text {
        width: 50%;
      }
    `,
  })}
`

const StyledScoreBar = styled(Block)<{
  fillColor: BarColors
}>`
  background-color: ${({ fillColor, theme }) => theme.colors[fillColor]};
`

export default CollectionConfidenceScore
