import React, { Component } from "react"
import styled from "styled-components"
import { selectClassNames } from "../../lib/helpers/styling"
import { $grey } from "../../styles/variables"
import Icon from "../common/Icon.react"
import Frame, { FrameConsumer } from "../layout/Frame.react"

export interface Props<T> {
  className?: string
  getKey: (item: T) => string
  header?: React.ReactNode
  isClosedOnSelect?: boolean
  items: ReadonlyArray<T>
  onItemClick: (item: T) => unknown
  render: (item: T) => React.ReactNode
  showAllOptions?: boolean
}

interface State {
  isOpen?: boolean
}

class Dropdown<T> extends Component<Props<T>, State> {
  state: State = {
    isOpen: false,
  }

  render() {
    const {
      className,
      getKey,
      header,
      isClosedOnSelect,
      items,
      onItemClick,
      render,
      showAllOptions,
    } = this.props

    const { isOpen } = this.state

    const content = (
      <>
        <div
          className="Dropdown--header"
          data-testid="Dropdown--header"
          onClick={() => this.setState({ isOpen: !isOpen })}
        >
          <div>{header}</div>
          <Icon
            className="Dropdown--icon"
            value={isOpen ? "expand_less" : "expand_more"}
          />
        </div>
        <ul
          className={selectClassNames("Dropdown", {
            items: true,
            showAllOptions,
          })}
        >
          {items.map(item => (
            <li
              className="Dropdown--item"
              data-testid="Dropdown--item"
              key={getKey(item)}
              onClick={() => {
                if (isClosedOnSelect) {
                  this.setState({ isOpen: false }, () => onItemClick(item))
                  return
                }
                onItemClick(item)
              }}
            >
              {render(item)}
            </li>
          ))}
        </ul>
      </>
    )

    return (
      <FrameConsumer>
        {({ isFramed }) => (
          <DivContainer
            className={selectClassNames(
              "Dropdown",
              { open: isOpen, isFramed },
              className,
            )}
            tabIndex={-1}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget as Element)) {
                this.setState({ isOpen: false })
              }
            }}
          >
            {isFramed ? (
              <div className="Dropdown--content-container">{content}</div>
            ) : (
              <Frame className="Dropdown--content-container">{content}</Frame>
            )}
          </DivContainer>
        )}
      </FrameConsumer>
    )
  }
}

export default Dropdown

const DivContainer = styled.div`
  cursor: pointer;
  height: 48px;
  outline: none;
  user-select: none;

  .Dropdown--content-container {
    position: relative;

    .Dropdown--header {
      background: ${props => props.theme.colors.input};
      color: ${props => props.theme.colors.text.on.input};
      align-items: center;
      display: flex;
      height: 48px;
      justify-content: space-between;
      padding: 0 12px;

      .Dropdown--icon {
        color: ${$grey};
      }
    }

    .Dropdown--items {
      background: ${props => props.theme.colors.input};
      color: ${props => props.theme.colors.text.on.input};
      max-height: 0;
      margin: 0;
      overflow-y: auto;

      .Dropdown--item {
        align-items: center;
        border-top: 1px solid ${props => props.theme.colors.border};
        display: flex;
        height: 48px;
        padding: 0 12px;

        &:first-child {
          border-top: none;
        }

        &:hover {
          background-color: ${props => props.theme.colors.hover};
        }
      }
    }
  }

  &.Dropdown--open {
    .Dropdown--content-container {
      box-shadow: 0px 1px 20px rgba(0, 0, 0, 0.25);
      z-index: 2;

      .Dropdown--header {
        border-bottom: 1px solid ${props => props.theme.colors.border};
      }

      .Dropdown--items {
        max-height: 200px;

        &.Dropdown--showAllOptions {
          max-height: fit-content;
        }
      }
    }
  }

  &.Dropdown--isFramed {
    border-radius: inherit;

    .Dropdown--content-container {
      border-radius: inherit;
    }
  }
`
