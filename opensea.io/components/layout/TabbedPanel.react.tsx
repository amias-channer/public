import React, { Component } from "react"
import styled from "styled-components"
import { selectClassNames } from "../../lib/helpers/styling"
import BasePanel from "./BasePanel.react"

type Tab = {
  label: string
  content: React.ReactNode
  onClick?: () => unknown
}

export interface Props {
  tabs: Tab[]
  initialActiveTabLabel?: string
}

interface State {
  activeTabLabel?: string
}

class TabbedPanel extends Component<Props, State> {
  state: State = {
    activeTabLabel:
      this.props.initialActiveTabLabel || this.props.tabs[0]?.label,
  }

  render() {
    const { tabs } = this.props
    const { activeTabLabel } = this.state

    return (
      <DivContainer>
        <BasePanel className="TabbedPanel--panel">
          {({ Header, Body }) => (
            <>
              <div
                className="TabbedPanel--headers"
                data-testid="TabbedPanel--headers"
              >
                {tabs.map(tab => (
                  <Header
                    className={selectClassNames(
                      "TabbedPanel--header",
                      {
                        isActive: tab.label === activeTabLabel,
                      },
                      "TabbedPanel--header",
                    )}
                    key={tab.label}
                    onClick={() =>
                      this.state.activeTabLabel !== tab.label &&
                      this.setState({ activeTabLabel: tab.label }, tab.onClick)
                    }
                  >
                    {tab.label}
                  </Header>
                ))}
              </div>
              <Body>{tabs.find(t => t.label === activeTabLabel)?.content}</Body>
            </>
          )}
        </BasePanel>
      </DivContainer>
    )
  }
}

export default TabbedPanel

const DivContainer = styled.div`
  .TabbedPanel--panel {
    background-color: transparent;
  }

  .TabbedPanel--headers {
    display: flex;
  }

  .TabbedPanel--header {
    flex: 1 0;
    font-weight: 500;
    margin: 0 4px;
    color: ${props => props.theme.colors.text.subtle};
    transition: color 0.2s;

    &:first-child {
      margin: 0 4px 0 0;
    }

    &:last-child {
      margin: 0 0 0 4px;
    }

    &.TabbedPanel--header:hover,
    &.TabbedPanel--header--isActive {
      color: ${props => props.theme.colors.text.heading};
      font-weight: 600;
    }
  }
`
