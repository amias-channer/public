import { WALLET_NAME } from "../../../constants"
import { AccountKey } from "../../chain/chain"
import { getTrackingFn } from "../utils"

export const trackOpenSidebarWallet = getTrackingFn("open sidebar wallet")
export const trackCloseSidebarWallet = getTrackingFn("close sidebar wallet")

export const trackClickSideBarWalletMoreOptions = getTrackingFn<{
  symbol: string
  chain: string
}>("click wallet sidebar token more options")

export type WalletNameParams = { walletName: WALLET_NAME }
export const trackConnectWallet = getTrackingFn<AccountKey & WalletNameParams>(
  "connect wallet",
)
export const trackSelectWallet = getTrackingFn<
  {
    source: "wallet sidebar" | "wallet page"
  } & WalletNameParams
>("select wallet")
