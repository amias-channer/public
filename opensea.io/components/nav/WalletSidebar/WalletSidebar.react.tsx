import React from "react"
import { Drawer } from "../../../design-system/Drawer"
import useAppContext from "../../../hooks/useAppContext"
import { $nav_height } from "../../../styles/variables"
import ConnectCompatibleWallet from "./ConnectCompatibleWallet.react"
import WalletFunds from "./WalletFunds.react"
import { WalletSidebarHeader } from "./WalletSidebarHeader.react"

export interface WalletSidebarProps {
  close: () => unknown
  onWalletSidebarClickAway: (e: MouseEvent | TouchEvent) => unknown
  isOpen: boolean
  isBannerShown?: boolean
}

export const WalletSidebar = ({
  isOpen,
  close,
  onWalletSidebarClickAway,
  isBannerShown = false,
}: WalletSidebarProps) => {
  const { wallet } = useAppContext()
  const address = wallet.activeAccount?.address

  return (
    <Drawer
      data-testid="WalletSidebar"
      isBannerShown={isBannerShown}
      isOpen={isOpen}
      navbarOffset={$nav_height}
      onClickAway={onWalletSidebarClickAway}
    >
      {({ fullscreenBreakpoint }) => (
        <>
          <WalletSidebarHeader
            close={close}
            fullscreenBreakpoint={fullscreenBreakpoint}
          />
          <Drawer.Body>
            {address ? (
              <WalletFunds variables={{ address }} />
            ) : (
              <ConnectCompatibleWallet />
            )}
          </Drawer.Body>
        </>
      )}
    </Drawer>
  )
}

export default WalletSidebar
