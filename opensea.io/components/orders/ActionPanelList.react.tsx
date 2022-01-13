import React, { useState } from "react"
import styled from "styled-components"
import { ChainIdentifier } from "../../constants"
import { ActionTransaction } from "../../lib/chain/trader"
import { ActionPanelList_data } from "../../lib/graphql/__generated__/ActionPanelList_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import Frame, { FrameProvider } from "../layout/Frame.react"
import ActionPanel from "./ActionPanel.react"

type Props = {
  data: ActionPanelList_data | null
  onEnd?: (transaction?: ActionTransaction) => unknown
  chain?: ChainIdentifier
}

const ActionPanelList = ({ data, onEnd, chain }: Props) => {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = (transaction?: ActionTransaction) => {
    const actions = data?.actions

    if (actions) {
      if (actions.length > currentStep) {
        setCurrentStep(prev => prev + 1)
      } else if (actions.length === currentStep) {
        onEnd?.(transaction)
      }
    }
  }

  return (
    <DivContainer>
      <Frame className="ActionPanelList--frame">
        <FrameProvider>
          {data?.actions?.map((action, n) =>
            action ? (
              <ActionPanel
                chain={chain}
                data={action}
                key={action.actionType + n}
                open={currentStep === n + 1}
                step={n + 1}
                onEnd={nextStep}
              />
            ) : null,
          )}
        </FrameProvider>
      </Frame>
    </DivContainer>
  )
}

const DivContainer = styled.div`
  .ActionPanelList--frame {
    background-color: ${props => props.theme.colors.header};
  }
`

export default fragmentize(ActionPanelList, {
  fragments: {
    data: graphql`
      fragment ActionPanelList_data on ActionDataType {
        actions {
          ...ActionPanel_data
          actionType
          signAndPost {
            orderData
            clientMessage
            serverSignature
            orderId
          }
          metaTransaction {
            clientMessage
            clientSignatureStandard
            functionSignature
            verifyingContract
          }
        }
      }
    `,
  },
})
