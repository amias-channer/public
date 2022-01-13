import React from "react"
import BigNumber from "bignumber.js"
import { UNISWAP_URL, WETH_ADDRESS, WETH_URL } from "../../constants"
import Block from "../../design-system/Block"
import { useTheme } from "../../design-system/Context/ThemeContext"
import Modal from "../../design-system/Modal"
import { useMultiStepFlowContext } from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import { bn } from "../../lib/helpers/numberUtils"
import IFrame from "../common/IFrame.react"

interface Props {
  tokenAddress?: string
  tokenSymbol?: string
  tokenInfoLink?: string
  tokenAmount?: BigNumber
}

export const UniswapStationModal = ({
  tokenSymbol = "WETH",
  tokenAddress = tokenSymbol === "WETH" ? WETH_ADDRESS : undefined,
  tokenInfoLink = tokenSymbol === "WETH" ? WETH_URL : undefined,
  tokenAmount = bn(0),
}: Props) => {
  const { onPrevious } = useMultiStepFlowContext()
  const { theme } = useTheme()
  const tokenInfo = tokenInfoLink ? (
    <a href={tokenInfoLink} rel="noreferrer" target="_blank">
      {tokenSymbol}
    </a>
  ) : (
    tokenSymbol
  )

  return (
    <>
      <Modal.Header onPrevious={onPrevious}>
        <Modal.Title>
          Convert {!tokenSymbol ? "crypto" : tokenSymbol}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Text textAlign="center" variant="small">
          Easily convert
          {!tokenSymbol ? " crypto" : " between ETH and "}
          {tokenInfo}
        </Text>
        <Block height="610px">
          <IFrame
            className="UniswapStation--iframe"
            url={`${UNISWAP_URL}?outputCurrency=${tokenAddress}&theme=${theme}&exactAmount=${tokenAmount.toNumber()}&exactField=output`}
          />
        </Block>
      </Modal.Body>
    </>
  )
}

export default UniswapStationModal
