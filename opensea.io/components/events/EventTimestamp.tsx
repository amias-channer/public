import React from "react"
import styled from "styled-components"
import Tooltip, { TOOLTIP_PLACEMENT } from "../../design-system/Tooltip"
import { EventTimestamp_data } from "../../lib/graphql/__generated__/EventTimestamp_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { fromNowWithSeconds, fromISO8601 } from "../../lib/helpers/datetime"
import ExternalLink from "../common/ExternalLink.react"
import Icon from "../common/Icon.react"
import LiveTimestamp from "../common/LiveTimestamp.react"

interface Props {
  className?: string
  data: EventTimestamp_data
}

const EventTimestamp = ({
  className,
  data: { eventTimestamp, transaction },
}: Props) => {
  const liveTimestamp = (
    <LiveTimestamp
      renderFormattedTimestamp={() =>
        fromNowWithSeconds(fromISO8601(eventTimestamp))
      }
    />
  )

  const liveDetailedTimestamp =
    fromISO8601(eventTimestamp).format("MMMM Do YY, h:mm a")

  return (
    <DivContainer className={className} data-testid="EventTimestamp">
      <Tooltip
        content={liveDetailedTimestamp}
        interactive
        placement={TOOLTIP_PLACEMENT.TOP}
      >
        {transaction ? (
          <ExternalLink url={transaction.blockExplorerLink}>
            {liveTimestamp}{" "}
            <Icon className="EventTimestamp--link-icon" value="open_in_new" />
          </ExternalLink>
        ) : (
          <span>{liveTimestamp}</span>
        )}
      </Tooltip>
    </DivContainer>
  )
}

export default fragmentize(EventTimestamp, {
  fragments: {
    data: graphql`
      fragment EventTimestamp_data on AssetEventType {
        eventTimestamp
        transaction {
          blockExplorerLink
        }
      }
    `,
  },
})

const DivContainer = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  .EventTimestamp--link-icon {
    font-size: 17px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
`
