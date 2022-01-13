import React from "react"
import {
  CANONICAL_CHAIN_IDENTIFIERS,
  ChainIdentifier,
  CHAIN_IDENTIFIERS_TO_NAMES,
} from "../../constants"
import { useWallet } from "../../containers/WalletProvider.react"
import Block from "../../design-system/Block"
import Modal from "../../design-system/Modal"
import Text from "../../design-system/Text"
import useAppContext from "../../hooks/useAppContext"
import Router from "../../lib/helpers/router"
import ActionButton from "../common/ActionButton.react"

interface Props {
  chainIdentifier?: ChainIdentifier
  children: React.ReactNode
}

export const NetworkUnsupportedGate = ({
  chainIdentifier,
  children,
}: Props) => {
  const switchWallet = () => Router.push("/wallet/locked")
  const { wallet, login } = useAppContext()
  const viewer = wallet.getActiveAccountKey()
  const { chain: userChain } = useWallet()

  const renderContent = () => {
    if (!chainIdentifier) {
      return null
    }

    const chainName = CHAIN_IDENTIFIERS_TO_NAMES[chainIdentifier]
    return (
      <>
        <Modal.Header>
          <Modal.Title>
            Please switch to a wallet that supports {chainName} network
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Text variant="body">
            In order to trade assets, connect to a {chainName} network wallet.
            Please lock your current wallet and connect with a wallet that
            supports {chainName} network.
          </Text>
        </Modal.Body>

        <Modal.Footer>
          <ActionButton onClick={switchWallet}>Connect Wallet</ActionButton>
        </Modal.Footer>
      </>
    )
  }

  if (!viewer || !userChain) {
    return <div onClick={() => login()}>{children}</div>
  }

  const condition =
    chainIdentifier &&
    !(chainIdentifier === CANONICAL_CHAIN_IDENTIFIERS[chainIdentifier]
      ? chainIdentifier === userChain
      : CANONICAL_CHAIN_IDENTIFIERS[chainIdentifier] ===
        CANONICAL_CHAIN_IDENTIFIERS[userChain])

  if (!condition) {
    return <>{children}</>
  }

  return (
    <Modal
      trigger={open => (
        <Block
          onClickCapture={event => {
            event.stopPropagation()
            event.preventDefault()
            open()
          }}
        >
          {children}
        </Block>
      )}
    >
      {renderContent}
    </Modal>
  )
}

export default NetworkUnsupportedGate
