import React from "react"
import styled from "styled-components"
import Icon, { MaterialIcon } from "./Icon.react"

interface Props {
  iconValue?: MaterialIcon
  left?: React.ReactNode
  right?: React.ReactNode
  className?: string
  blur?: boolean
}

const SectionHeader = ({ iconValue, left, right, className }: Props) => {
  return (
    <DivContainer className={className}>
      <div>
        {iconValue ? (
          <Icon className="SectionHeader--icon" value={iconValue} />
        ) : null}
        {left}
      </div>
      {right ? <div>{right}</div> : null}
    </DivContainer>
  )
}

export default SectionHeader

const DivContainer = styled.div`
  align-items: center;
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  display: flex;
  font-size: 14px;
  font-weight: 500;
  justify-content: space-between;
  letter-spacing: 1px;
  padding-bottom: 10px;
  text-transform: uppercase;
  margin-bottom: 20px;

  .SectionHeader--icon {
    font-size: 24px;
    margin-right: 3px;
    margin-bottom: 3px;
    vertical-align: middle;
  }
`
