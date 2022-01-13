import React from "react"
import styled from "styled-components"
import Text from "../../design-system/Text"

type Props = Omit<JSX.IntrinsicElements["label"], "ref"> & {
  children: React.ReactNode
  className?: string
  label: React.ReactNode
  subLabel?: React.ReactNode
}

export default class Label extends React.Component<Props> {
  render() {
    const { children, className, label, subLabel, ...labelProps } = this.props

    return (
      <DivContainer className={className} data-testid="Label">
        <div className="Label--labels">
          <Text
            as="label"
            marginBottom="6px"
            marginLeft="2px"
            variant="bold"
            {...labelProps}
          >
            {label}
          </Text>
          {subLabel ? (
            <Text as="div" variant="small">
              {subLabel}
            </Text>
          ) : null}
        </div>
        {children}
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  margin: 6px 0 32px;
  .Label--labels {
    display: flex;
    justify-content: space-between;
  }
  .Label--main {
    color: ${props => props.theme.colors.text.body};
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 6px 2px;
  }
`
