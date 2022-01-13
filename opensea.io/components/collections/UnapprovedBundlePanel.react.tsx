import React from "react"
import styled from "styled-components"
import Text from "../../design-system/Text"
import Panel from "../layout/Panel.react"

const UnapprovedBundlePanel = () => {
  return (
    <DivContainer>
      <Panel
        className="UnapprovedPanel--unapproved-panel"
        icon="warning"
        iconColor="yellow"
        mode="start-closed"
        title={
          <Text
            className="UnapprovedPanel--unapproved-panel-header-text"
            variant="h1"
          >
            This bundle contains at least one item that has not been reviewed by
            OpenSea
          </Text>
        }
        variant="warning"
      >
        <Text variant="small">
          You should proceed with extra caution. Anyone can create a digital
          item on a blockchain with any name, including fake versions of
          existing items. Please take extra caution and do your research when
          interacting with this bundle to ensure it's what it claims to be.
        </Text>
      </Panel>
    </DivContainer>
  )
}

export default UnapprovedBundlePanel

const DivContainer = styled.div`
  .UnapprovedPanel--unapproved-panel {
    margin-bottom: 20px;
    border: 1px solid ${props => props.theme.colors.border} !important;

    .Panel--body {
      border: none;
    }

    .UnapprovedPanel--unapproved-panel-header-text {
      font-size: 15px !important;
      margin: 0;
    }
  }
`
