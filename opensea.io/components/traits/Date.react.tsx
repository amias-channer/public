import React from "react"
import moment from "moment"
import { useFragment } from "react-relay"
import styled from "styled-components"
import { Date_trait$key } from "../../lib/graphql/__generated__/Date_trait.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { fromEpoch } from "../../lib/helpers/datetime"
import { snakeCaseToCapitalCase } from "../../lib/helpers/stringUtils"

interface Props {
  className?: string
  trait: Date_trait$key
}

const Date = ({ className, trait: traitDataKey }: Props) => {
  const { traitType, floatValue, intValue } = useFragment(
    graphql`
      fragment Date_trait on TraitType {
        traitType
        floatValue
        intValue
      }
    `,
    traitDataKey,
  )

  const value = floatValue === null ? intValue : floatValue
  if (value === null) {
    return null
  }
  const valueMoment = fromEpoch(+value)
  const humanDate = valueMoment.format("dddd, MMMM Do, YYYY")

  const isYearValue = valueMoment.isSame(moment(valueMoment).startOf("year"))
  const trimmedDate = isYearValue ? valueMoment.format("YYYY") : ""

  return (
    <DivContainer className={className}>
      <div className="Date--label">
        <div className="Date--type">{snakeCaseToCapitalCase(traitType)}</div>
        <div className="Date--value">
          {trimmedDate ? trimmedDate : humanDate}
        </div>
      </div>
    </DivContainer>
  )
}

export default Date

const DivContainer = styled.div`
  cursor: pointer;

  .Date--label {
    display: flex;
    font-weight: 500;
    justify-content: space-between;

    .Date--value {
      color: ${props => props.theme.colors.text.subtle};
      min-width: fit-content;
      padding-left: 4px;
    }
  }
`
