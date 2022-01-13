import React from "react"
import styled from "styled-components"
import {
  COINBASE_LINK,
  GEMINI_LINK,
  KRAKEN_LINK,
  ETORO_LINK,
} from "../../constants"
import Modal from "../../design-system/Modal"
import { useMultiStepFlowContext } from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import Tooltip, { TOOLTIP_PLACEMENT } from "../../design-system/Tooltip"
import useAppContext from "../../hooks/useAppContext"
import { useMountEffect } from "../../hooks/useMountEffect"
import { trackOpenDepositModal } from "../../lib/analytics/events/checkoutEvents"
import { truncateAddress } from "../../lib/helpers/addresses"
import ActionButton from "../common/ActionButton.react"
import Icon from "../common/Icon.react"
import Link from "../common/Link.react"
import TextCopyInput from "../forms/TextCopyInput.react"

interface Props {
  onClose?: () => unknown
  address: string
  symbol: string
}

export const DepositModal = ({ onClose, address, symbol }: Props) => {
  const { isMobile } = useAppContext()
  const { onPrevious } = useMultiStepFlowContext()

  useMountEffect(() => {
    trackOpenDepositModal({ address, symbol })
  })

  const symbolText = !symbol ? "crypto" : symbol
  return (
    <DivContainer>
      <Modal.Header onPrevious={onPrevious}>
        <Modal.Title>Deposit {symbolText} from your exchange</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Text textAlign="center" variant="small">
          Deposit {symbolText} from your
          <Tooltip
            content={
              <>
                An exchange allows individuals to trade cryptocurrencies.
                Compatible crypto exchanges include
                <Link href={COINBASE_LINK}> Coinbase</Link>,
                <Link href={GEMINI_LINK}> Gemini</Link>,
                <Link href={KRAKEN_LINK}> Kraken</Link>,
                <Link href={ETORO_LINK}> eToro</Link>, and many other exchanges.
              </>
            }
            interactive
            placement={TOOLTIP_PLACEMENT.BOTTOM}
          >
            <span className="DepositModal--label">
              {" "}
              exchange
              <span className="DepositModal--info-icon">
                <Icon
                  color="blue"
                  cursor="default"
                  size={18}
                  value="info"
                  variant="outlined"
                />
              </span>
            </span>
          </Tooltip>{" "}
          to the following address:
        </Text>
        <TextCopyInput
          className="DepositModal--copier"
          textToCopy={address}
          textToShow={isMobile ? truncateAddress(address) : address}
        />
        {symbol == "ETH" && (
          <Text textAlign="center" variant="small">
            Only send {symbolText} or any other ERC-20 token to this address.
          </Text>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="DepositModal--button">
          <ActionButton onClick={onClose}>I've made my deposit</ActionButton>
        </div>
      </Modal.Footer>
    </DivContainer>
  )
}

export default DepositModal

const DivContainer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 20px;
  vertical-align: middle;
  justify-content: center;

  .DepositModal--label {
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
    cursor: pointer;
    margin: auto;
    line-height: 14px;

    &:hover {
      color: ${props => props.theme.colors.darkSeaBlue};
    }

    .DepositModal--info-icon {
      display: inline-block;
      margin: auto;
      margin-left: 2px;
      vertical-align: middle;
    }
  }

  .DepositModal--button {
    display: flex;
    justify-content: center;
  }
`
