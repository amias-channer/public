import React from "react"
import styled from "styled-components"
import { appendClassName, selectClassNames } from "../../lib/helpers/styling"

interface HeaderProps {
  children: React.ReactNode
  className?: string
  isDisabled?: boolean
  onClick?: () => unknown
}
interface BodyProps {
  children?: React.ReactNode
  className?: string
}
interface FooterProps {
  children?: React.ReactNode
  className?: string
}
interface Props {
  className?: string
  children: (props: {
    Header: React.ElementType<HeaderProps>
    Body: React.ElementType<BodyProps>
    Footer: React.ElementType<FooterProps>
  }) => React.ReactNode
}

export default class BasePanel extends React.Component<Props> {
  renderHeader = ({
    children,
    className,
    isDisabled,
    onClick,
  }: HeaderProps) => (
    <header
      className={selectClassNames(
        "BasePanel--header",
        {
          isDisabled,
        },
        appendClassName("BasePanel--header", className),
      )}
      onClick={onClick}
    >
      {children}
    </header>
  )

  renderBody = ({ children, className }: BodyProps) => (
    <div className={appendClassName("BasePanel--body", className)}>
      {children}
    </div>
  )

  renderFooter = ({ children, className }: FooterProps) => (
    <div className={appendClassName("BasePanel--footer", className)}>
      {children}
    </div>
  )

  render() {
    const { className, children } = this.props

    return (
      <DivContainer className={className}>
        {children({
          Header: this.renderHeader,
          Body: this.renderBody,
          Footer: this.renderFooter,
        })}
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  border-radius: 5px;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.heading};
  background-color: ${props => props.theme.colors.header};
  overflow: hidden;

  .BasePanel--header {
    align-items: center;
    cursor: pointer;
    display: flex;
    font-size: 16px;
    font-weight: 600;
    padding: 20px;
    user-select: none;
    background-color: ${props => props.theme.colors.header};

    &.BasePanel--header--isDisabled {
      cursor: initial;
      color: ${props => props.theme.colors.text.subtle};
    }
  }

  .BasePanel--body {
    border-top: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.body};
    background-color: ${props => props.theme.colors.surface};
  }

  .BasePanel--footer {
    border-top: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.body};
    background-color: ${props => props.theme.colors.header};
  }
`
