import React from "react"
import styled from "styled-components"
import { bn, display } from "../../lib/helpers/numberUtils"
import { snakeCaseToCapitalCase } from "../../lib/helpers/stringUtils"

interface Props {
  className?: string
  type: string
  rankingMode?: boolean
  value: number
  maxValue: number | undefined | null
}

export const NumericTraitCell = ({
  className,
  type,
  rankingMode,
  value,
  maxValue,
}: Props) => {
  return (
    <DivContainer className={className}>
      <div className="NumericTrait--label">
        <div className="NumericTrait--type">
          {/* TODO: localize instead of snakeCaseToCapitalCase() */}
          {snakeCaseToCapitalCase(type)}
        </div>
        <div className="NumericTrait--value">
          {display(value)}
          {maxValue && ` of ${display(maxValue)}`}
        </div>
      </div>
      {maxValue && rankingMode ? (
        <div className="NumericTrait--bar">
          <div
            className="NumericTrait--bar-fill"
            style={{
              width: `${bn(value).times(100).div(maxValue).round()}%`,
            }}
          />
        </div>
      ) : null}
    </DivContainer>
  )
}

const DivContainer = styled.div`
  cursor: pointer;

  .NumericTrait--label {
    display: flex;
    font-weight: 500;
    justify-content: space-between;

    .NumericTrait--type {
      color: ${props => props.theme.colors.text.subtle};
    }

    .NumericTrait--value {
      color: ${props => props.theme.colors.text.subtle};
      min-width: fit-content;
      padding-left: 4px;
    }
  }

  .NumericTrait--bar {
    background-color: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 14px;
    height: 14px;
    margin-top: 4px;
    overflow: hidden;

    .NumericTrait--bar-fill {
      background-color: ${props => props.theme.colors.primary};
      height: 100%;
    }
  }
`
