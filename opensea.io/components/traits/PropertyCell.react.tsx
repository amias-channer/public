import React from "react"
import styled from "styled-components"
import { snakeCaseToCapitalCase } from "../../lib/helpers/stringUtils"

type Props = {
  className?: string
  value: string
  type: string
  count?: number
  percentage?: number
  disablePercentages?: boolean
}

export const PropertyCell = ({
  className,
  value,
  type,
  count,
  percentage,
  disablePercentages,
}: Props) => {
  return (
    <DivContainer className={className}>
      <div className="Property--type">
        {/* TODO: localize instead of snakeCaseToCapitalCase() */}
        {snakeCaseToCapitalCase(type)}
      </div>
      <div className="Property--value" data-testid="Property--value">
        {snakeCaseToCapitalCase(value)}
      </div>
      {!disablePercentages && (
        <div className="Property--rarity">
          {percentage === undefined
            ? "New trait"
            : percentage >= 1
            ? `${Math.round(percentage)}% have this trait`
            : percentage >= 0.01
            ? `${percentage.toFixed(2)}% have this trait`
            : `1 of ${count}`}
        </div>
      )}
    </DivContainer>
  )
}

const DivContainer = styled.div`
  background-color: ${props =>
    props.theme.colors.withOpacity.secondary.veryLight};
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.secondary};
  padding: 10px;
  text-align: center;

  .Property--type,
  .Property--value,
  .Property--rarity {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .Property--type {
    color: ${props => props.theme.colors.secondary};
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .Property--value {
    color: ${props => props.theme.colors.text.body};
    font-size: 15px;
    font-weight: 500;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Property--rarity {
    color: ${props => props.theme.colors.text.subtle};
    font-size: 13px;
    line-height: 16px;
    min-height: 16px;
  }
`
