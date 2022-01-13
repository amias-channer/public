import React from "react"
import moment from "moment"
import styled from "styled-components"
import Flex from "../../design-system/Flex"
import Text from "../../design-system/Text"
import { Countdown } from "./Countdown.react"

interface Props {
  prefix?: React.ReactNode
  postfix?: React.ReactNode
  includeDate?: boolean
  endMoment?: moment.Moment
}

const Expiration = ({ prefix, postfix, includeDate, endMoment }: Props) => {
  const startOfEndingDay = endMoment
    ? moment(endMoment).local().startOf("day")
    : undefined
  const startOfToday = moment().startOf("day")
  const startOfTomorrow = moment(startOfToday).add(1, "day")

  return (
    <Container>
      {prefix ?? null}
      {endMoment && startOfEndingDay ? (
        startOfEndingDay.isSameOrBefore(startOfTomorrow) ? (
          <>
            &nbsp;
            <Text color="inherit" margin="0" variant="bold">
              {startOfEndingDay.isSame(startOfToday) ? "today" : "tomorrow"}
            </Text>
            &nbsp;in&nbsp;
            <Text color="inherit" margin="0" variant="bold">
              <Countdown moment={endMoment} />
            </Text>
          </>
        ) : (
          <>
            &nbsp;in&nbsp;
            <Text color="inherit" margin="0" variant="bold">
              {moment
                .duration(startOfEndingDay.diff(startOfToday, "days"), "days")
                .asDays()}{" "}
              days
            </Text>
            &nbsp;
          </>
        )
      ) : null}
      {endMoment && includeDate ? (
        <span>
          &nbsp; ({endMoment.local().format("MMMM D, YYYY [at] h:mma")}{" "}
          {moment.tz(moment.tz.guess()).zoneAbbr()})
        </span>
      ) : null}
      {postfix ?? null}
      &nbsp;
    </Container>
  )
}

export default Expiration

const Container = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
`
