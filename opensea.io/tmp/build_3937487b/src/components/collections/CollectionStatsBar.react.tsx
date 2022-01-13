import React from "react"
import styled, { css } from "styled-components"
import { Avatar } from "../../design-system/Avatar"
import Flex from "../../design-system/Flex"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import UnstyledButton from "../../design-system/UnstyledButton"
import { CollectionStatsBar_data } from "../../lib/graphql/__generated__/CollectionStatsBar_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import {
  bn,
  shortSymbolDisplay,
  roundAboveMin,
} from "../../lib/helpers/numberUtils"
import { pluralize } from "../../lib/helpers/stringUtils"
import { themeVariant } from "../../styles/styleUtils"
import Icon, { MaterialIcon } from "../common/Icon.react"
import InfoContainer from "../common/InfoContainer.react"
import InfoItem from "../common/InfoItem.react"
import { sizeMQ } from "../common/MediaQuery.react"

interface Props {
  data: CollectionStatsBar_data
  small?: boolean
}
const CollectionStatsBar = ({ data, small }: Props) => {
  if (!data) {
    return null
  }
  const { slug } = data
  const { floorPrice, numOwners, totalSupply, totalVolume } = data.stats
  const isValidFloorPrice = !(floorPrice === null || floorPrice === 0)
  return small ? (
    <Container className="CollectionStatsBar--small">
      <SmallStat
        content={
          bn(data.stats.totalSupply).greaterThan(bn(10).toPower(9))
            ? "> 1B"
            : shortSymbolDisplay(data.stats.totalSupply)
        }
        icon="filter_none"
        tooltip="Total Items"
      />
      <SmallStat
        content={shortSymbolDisplay(numOwners)}
        icon="group"
        tooltip="Total Owners"
      />
      <SmallStat
        content={isValidFloorPrice ? `㆔${floorPrice}` : "---"}
        icon="local_offer"
        tooltip="Floor Price"
      />
      <SmallStat
        content={`㆔${
          totalVolume < 1
            ? totalVolume.toFixed(2)
            : totalVolume < 100
            ? totalVolume.toFixed(1)
            : shortSymbolDisplay(totalVolume)
        }`}
        icon="compare_arrows"
        tooltip="Volume Traded"
      />
    </Container>
  ) : (
    <Container>
      <InfoItem
        className="CollectionStatsBar--info CollectionStatsBar--bottom-bordered"
        icon={
          <Stat
            header={
              bn(data.stats.totalSupply).greaterThan(bn(10).toPower(9))
                ? "> 1B"
                : shortSymbolDisplay(data.stats.totalSupply)
            }
          />
        }
        label={pluralize("item", totalSupply)}
        url={`/assets/${slug}`}
      />
      <InfoItem
        className="CollectionStatsBar--info CollectionStatsBar--bottom-bordered"
        icon={<Stat header={shortSymbolDisplay(numOwners)} />}
        label={pluralize("owner", numOwners)}
        url={`/activity/${slug}`}
      />
      <InfoItem
        className="CollectionStatsBar--info"
        icon={
          <Stat
            header={
              floorPrice === null || floorPrice === 0
                ? "---"
                : roundAboveMin(floorPrice)
            }
            isEth={isValidFloorPrice}
          />
        }
        label="floor price"
        url={`/assets/${slug}?search[resultModel]=ASSETS&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW`}
      />
      <InfoItem
        className="CollectionStatsBar--info"
        icon={
          <Stat
            header={`${
              totalVolume < 1
                ? totalVolume.toFixed(2)
                : totalVolume < 100
                ? totalVolume.toFixed(1)
                : shortSymbolDisplay(totalVolume)
            }`}
            isEth
          />
        }
        label="volume traded"
        url={`/activity/${slug}`}
      />
    </Container>
  )
}

export default fragmentize(CollectionStatsBar, {
  fragments: {
    data: graphql`
      fragment CollectionStatsBar_data on CollectionType {
        stats {
          floorPrice
          numOwners
          totalSupply
          totalVolume
          floorPrice
        }
        slug
      }
    `,
  },
})

interface StatProps {
  header: string | number
  isEth?: boolean
}

const Stat = ({ header, isEth }: StatProps) => (
  <>
    {isEth ? (
      <Tooltip content="ETH">
        <UnstyledButton>
          <Avatar
            className="CollectionStatsBar--eth-icon"
            size={20}
            src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
          />
        </UnstyledButton>
      </Tooltip>
    ) : null}
    <Text variant="h3">{header}</Text>
  </>
)

interface SmallStatProps {
  tooltip: string
  content: React.ReactNode
  icon: MaterialIcon
}

const SmallStat = ({ tooltip, content, icon }: SmallStatProps) => (
  <Tooltip content={tooltip}>
    <Flex className="CollectionStatsBar--small-stat">
      <Flex alignItems="center" marginRight="4px">
        <Icon
          className="CollectionStatsBar--small-icon"
          size={15}
          value={icon}
        />
      </Flex>
      {content}
    </Flex>
  </Tooltip>
)

const Container = styled(InfoContainer)`
  height: 178px;
  width: 291px;

  *:first-child > a > * {
    border-top-left-radius: ${props => props.theme.borderRadius.default};
    border-bottom-left-radius: ${props => props.theme.borderRadius.default};
  }
  *:last-child > a > * {
    border-top-right-radius: ${props => props.theme.borderRadius.default};
    border-bottom-right-radius: ${props => props.theme.borderRadius.default};
  }

  &.CollectionStatsBar--small {
    height: 22px;
    width: 100%;
    border: 0;
    color: ${props => props.theme.colors.text.subtle};
    justify-content: space-evenly;
    margin: 20px 0;
    font-size: 12px;
    font-weight: 600;

    .CollectionStatsBar--small-stat {
      padding: 6px;
      border-radius: ${props => props.theme.borderRadius.default};

      ${props =>
        themeVariant({
          variants: {
            light: {
              backgroundColor: props.theme.colors.withOpacity.fog.light,
            },
            dark: {
              backgroundColor: props.theme.colors.onyx,
            },
          },
        })}

      &:hover {
        ${props =>
          themeVariant({
            variants: {
              dark: {
                color: props.theme.colors.white,
              },
            },
          })}
      }
    }

    .CollectionStatsBar--small-stat:hover {
      ${props =>
        themeVariant({
          variants: {
            light: {
              color: props.theme.colors.oil,
            },
          },
        })}

      .CollectionStatsBar--small-icon:hover {
        color: inherit;
      }
    }
  }

  .CollectionStatsBar--eth-icon {
    ${themeVariant({
      variants: {
        dark: {
          filter: "brightness(3)",
        },
      },
    })}
  }

  .CollectionStatsBar--info {
    width: 144px;
    height: 88px;
    border-radius: inherit;
  }

  .CollectionStatsBar--bottom-bordered {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  ${sizeMQ({
    medium: css`
      width: fit-content;
      height: initial;

      .CollectionStatsBar--bottom-bordered {
        border-bottom: 0;
      }
    `,
  })}
`
