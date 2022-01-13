import React from "react"
import styled from "styled-components"
import Flex from "../../design-system/Flex"
import Loader from "../../design-system/Loader/Loader.react"
import { useTranslations } from "../../hooks/useTranslations"
import Ethereum from "../../lib/chain/networks/ethereum"
import { getState } from "../../store"
import ActionButton from "./ActionButton.react"
import CenterAligned from "./CenterAligned.react"

interface LoadingProps {
  relative?: boolean
  blockchain?: boolean
}

const Loading = ({ relative, blockchain }: LoadingProps) => {
  const { exchange } = getState()
  const { tr } = useTranslations()

  const renderSpinner = () => {
    return (
      <CenterAligned>
        <Loader size="large" />
      </CenterAligned>
    )
  }

  if (relative) {
    return <DivLoadingBlock>{renderSpinner()}</DivLoadingBlock>
  }

  if (!blockchain) {
    return renderSpinner()
  }

  return (
    <div>
      <DivLoadingBlock>{renderSpinner()}</DivLoadingBlock>
      <Flex as="h6" justifyContent="center">
        {tr("Waiting for blockchain confirmation...")}
      </Flex>
      {exchange.pendingTransactionHash && (
        <Flex justifyContent="center">
          <ActionButton
            href={Ethereum.getTransactionUrl(exchange.pendingTransactionHash)}
          >
            View Transaction
          </ActionButton>
        </Flex>
      )}
    </div>
  )
}

export default Loading

const DivLoadingBlock = styled.div`
  /** Use this class on a div around a Loading element
 * to make it a block inline on the page */
  position: relative;
  width: 100%;
  height: 150px;
`
