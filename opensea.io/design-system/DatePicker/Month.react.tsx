import React from "react"
import _ from "lodash"
import moment, { Moment } from "moment"
import styled, { css } from "styled-components"
import Icon from "../../components/common/Icon.react"
import { inRange } from "../../lib/helpers/datetime"
import Block from "../Block"
import Flex from "../Flex"
import SpaceBetween from "../SpaceBetween"
import UnstyledButton from "../UnstyledButton"

const NUM_DAYS_IN_WEEK = 7

const getWeeksForMonth = (date: Moment): Moment[][] => {
  const startOfMonth = date.clone().startOf("month")
  const endOfMonth = date.clone().endOf("month")
  const startWeek = startOfMonth.startOf("week")
  const endWeek = endOfMonth.endOf("week")
  const numDays = endWeek.diff(startWeek, "days") + 1

  const dates = Array(numDays)
    .fill(null)
    .map((_, i) =>
      startWeek
        .clone()
        .add(i, "days")
        .hours(date.hours())
        .minutes(date.minutes()),
    )

  return _.chunk(dates, NUM_DAYS_IN_WEEK)
}

interface MonthProps {
  date: Moment
  min?: Moment
  max?: Moment
  selectedDate?: Moment
  onChange: (date: Moment) => unknown
}

export const Month = ({
  date,
  min,
  max,
  selectedDate,
  onChange,
}: MonthProps) => {
  const weeks = getWeeksForMonth(date)
  return (
    <Block padding="16px">
      <Flex role="presentation">
        {moment.weekdaysMin().map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
      </Flex>
      <div role="grid">
        {weeks.map((daysOfWeek, i) => (
          <Flex key={i} role="row">
            {daysOfWeek.map(day => {
              const selected = day.isSame(selectedDate, "day")
              const inMonth = day.month() === date.month()
              return (
                <Day
                  $selected={selected}
                  disabled={!inRange(day, { min, max }) || !inMonth}
                  key={day.toString()}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => {
                    !selected && onChange(day)
                  }}
                >
                  {inMonth ? day.date() : null}
                </Day>
              )
            })}
          </Flex>
        ))}
      </div>
    </Block>
  )
}

interface MonthHeaderProps {
  date: Moment
  min?: Moment
  max?: Moment
  onChange: (date: Moment) => unknown
}

const MonthHeader = ({ date, min, max, onChange }: MonthHeaderProps) => {
  const monthBefore = date
    .clone()
    .subtract(1, "month")
    .endOf("month")
    .hours(date.hours())
    .minutes(date.minutes())
  const monthAfter = date
    .clone()
    .add(1, "month")
    .startOf("month")
    .hours(date.hours())
    .minutes(date.minutes())

  const backButton = (
    <UnstyledButton onClick={() => onChange(monthBefore)}>
      <Icon
        aria-label="Previous month"
        color="gray"
        cursor="pointer"
        value="arrow_back"
      />
    </UnstyledButton>
  )

  const forwardButton = (
    <UnstyledButton onClick={() => onChange(monthAfter)}>
      <Icon
        aria-label="Next month"
        color="gray"
        cursor="pointer"
        value="arrow_forward"
      />
    </UnstyledButton>
  )
  return (
    <SpaceBetween alignItems="center" as="header" padding="16px" width="100%">
      <div>{inRange(monthBefore, { min, max }) && backButton}</div>
      {date.format("MMMM YYYY")}
      <div>{inRange(monthAfter, { min, max }) && forwardButton}</div>
    </SpaceBetween>
  )
}

const baseDayStyles = css`
  width: 30px;
  height: 30px;
  margin: 2px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.subtle};
`

const disabledStyles = css`
  pointer-events: none;
  opacity: 0.25;
`

const selectedStyles = css`
  color: ${props => props.theme.colors.text.heading};
  background-color: ${props => props.theme.colors.hover};
`

const hoverStyles = css`
  :hover {
    box-shadow: ${props => props.theme.shadow};
  }
`

const DayHeader = styled.div`
  ${baseDayStyles}
  font-size: 12px;
`

const Day = styled(UnstyledButton)<{
  $selected: boolean
}>`
  ${baseDayStyles}
  color: ${props => props.theme.colors.text.subtle};
  border-radius: ${props => props.theme.borderRadius.default};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;

  ${props => props.disabled && disabledStyles}
  ${props => (props.$selected ? selectedStyles : hoverStyles)}
`

export default Object.assign(Month, {
  Header: MonthHeader,
})
