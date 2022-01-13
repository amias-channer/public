import React, { Component } from "react"
import styled from "styled-components"
import { appendClassName, selectClassNames } from "../../lib/helpers/styling"
import Icon, {
  IconColor,
  MaterialIcon,
  MaterialTheme,
} from "../common/Icon.react"
import BasePanel from "./BasePanel.react"
import { FrameConsumer } from "./Frame.react"

const ANIMATION_DURATION_IN_MILLISECONDS = 100

export interface Props {
  bodyClassName?: string
  children?: React.ReactNode
  className?: string
  headerClassName?: string
  footerClassName?: string
  FooterButton?: React.ReactNode
  icon?: MaterialIcon
  iconTheme?: MaterialTheme
  iconColor?: IconColor
  isContentPadded: boolean
  maxHeight?: number
  mode: "start-closed" | "start-open" | "always-open"
  title: React.ReactNode
  variant?: "default" | "warning"
}

interface State {
  contentHeight?: number
  isOpen: boolean
}

class Panel extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    isContentPadded: true,
    mode: "start-closed",
    variant: "default",
  }

  contentRef: HTMLDivElement | null = null

  state: State = {
    isOpen:
      !!React.Children.count(this.props.children) &&
      (this.props.mode === "start-open" || this.props.mode === "always-open"),
  }

  render() {
    const {
      bodyClassName,
      children,
      className,
      headerClassName,
      footerClassName,
      FooterButton,
      icon,
      iconTheme,
      iconColor,
      isContentPadded,
      maxHeight,
      mode,
      title,
      variant,
    } = this.props
    const { contentHeight, isOpen } = this.state
    const isDisabled = !React.Children.count(children)

    return (
      <FrameConsumer>
        {({ isFramed }) => (
          <DivContainer
            className={selectClassNames(
              "Panel",
              {
                alwaysOpen: mode === "always-open",
                isOpen,
                isClosed: !isOpen,
                isFramed,
                warning: variant === "warning",
              },
              className,
            )}
            data-testid="Panel"
          >
            <BasePanel className="Panel--panel">
              {({ Header, Body, Footer }) => (
                <>
                  <Header
                    className={appendClassName(
                      "Panel--header",
                      headerClassName,
                    )}
                    isDisabled={isDisabled}
                    onClick={() =>
                      React.Children.count(children) &&
                      mode !== "always-open" &&
                      this.setState(
                        {
                          contentHeight: this.contentRef?.scrollHeight,
                          isOpen: !isOpen,
                        },
                        () =>
                          setTimeout(
                            () => this.setState({ contentHeight: undefined }),
                            ANIMATION_DURATION_IN_MILLISECONDS,
                          ),
                      )
                    }
                  >
                    {icon && (
                      <Icon
                        className="Panel--icon"
                        color={iconColor}
                        value={icon}
                        variant={iconTheme}
                      />
                    )}
                    {typeof title === "string" ? <span>{title}</span> : title}
                    <Icon
                      className={selectClassNames("Panel", {
                        toggle: true,
                        isEnabled: !isDisabled,
                      })}
                      value={isOpen ? "expand_less" : "expand_more"}
                      variant={iconTheme}
                    />
                  </Header>
                  <Body
                    className={appendClassName(
                      "Panel--body",
                      variant == "warning" ? "Panel--body-warning" : "",
                    )}
                  >
                    <div
                      className="Panel--content-container"
                      ref={ref => {
                        this.contentRef = ref
                      }}
                      style={{
                        height: isOpen ? contentHeight || "initial" : 0,
                        maxHeight,
                        overflow: maxHeight ? "auto" : undefined,
                      }}
                    >
                      <div
                        className={selectClassNames(
                          "Panel",
                          {
                            isContentPadded,
                          },
                          bodyClassName,
                        )}
                      >
                        {children}
                      </div>
                    </div>
                  </Body>
                  {isOpen && FooterButton && (
                    <Footer
                      className={appendClassName(
                        "Panel--footer",
                        footerClassName,
                      )}
                    >
                      {isOpen && FooterButton}
                    </Footer>
                  )}
                </>
              )}
            </BasePanel>
          </DivContainer>
        )}
      </FrameConsumer>
    )
  }
}

export default Panel

const DivContainer = styled.div`
  &.Panel--isOpen {
    .Panel--content-container {
      overflow: visible;
    }
  }

  &.Panel--isClosed {
    .Panel--header {
      margin-bottom: 2px;
    }

    .Panel--body {
      border: none;
    }
  }

  &.Panel--isFramed {
    .Panel--panel,
    .Panel--header,
    .Panel--body {
      border-radius: 0;
    }

    .Panel--panel {
      border-top: none;
      border-left: none;
      border-right: none;
      margin-bottom: -1px;
      margin-top: 1px;
    }

    .Panel--header {
      border: 0;
      margin: 0;
    }

    .Panel--body {
      border-left: 0;
      border-right: 0;
    }
  }

  .Panel--icon {
    margin-right: 10px;
  }

  .Panel--toggle {
    margin-left: auto;
    color: ${props => props.theme.colors.withOpacity.text.heading.medium};
  }

  .Panel--content-container {
    overflow: hidden;
    transition: ${ANIMATION_DURATION_IN_MILLISECONDS}ms;
  }

  .Panel--header {
    &:hover {
      .Panel--toggle.Panel--isEnabled {
        color: ${props => props.theme.colors.text.heading};
      }
    }

    .Panel--header-text {
      display: flex;
      align-items: center;
    }
  }

  .Panel--content-container {
    overflow: hidden;
    transition: height ${ANIMATION_DURATION_IN_MILLISECONDS}ms;
  }

  .Panel--isContentPadded {
    padding: 20px;
    border-radius: 0 0 5px 5px;
  }

  &.Panel--alwaysOpen {
    .Panel--header {
      cursor: initial;

      .Panel--toggle {
        display: none;
      }
    }
  }

  &.Panel--warning {
    border-radius: 5px;

    .Panel--panel {
      border-bottom: none;
    }

    &.Panel--isClosed {
      border-bottom: 1px solid ${props => props.theme.colors.warning};

      .Panel--body-warning {
        border: none;
      }

      .Panel--header {
        border-radius: 5px;
      }
    }

    .Panel--body-warning {
      background-color: ${props =>
        props.theme.colors.withOpacity.warning.veryLight};
      border: 1px solid ${props => props.theme.colors.warning};
    }

    .Panel--header {
      background-color: ${props =>
        props.theme.colors.withOpacity.warning.veryLight};
      border-color: ${props => props.theme.colors.warning};
      border-radius: inherit inherit 0px 0px;
      margin-bottom: 0px;
      padding: 20px 15px;
    }
  }
`
