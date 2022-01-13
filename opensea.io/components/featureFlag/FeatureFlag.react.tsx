import React from "react"
import { IS_CI_BUILD, IS_DEVELOPMENT, IS_STAGING } from "../../constants"
import useAppContext from "../../hooks/useAppContext"
import Wallet from "../../lib/chain/wallet"

export type FeatureFlag = "staff"
interface Props {
  flags: FeatureFlag[]
  children: React.ReactNode
}

const flagConditions: Record<FeatureFlag, (wallet: Wallet) => boolean> = {
  staff: wallet =>
    wallet.isStaff || IS_DEVELOPMENT || IS_CI_BUILD || IS_STAGING,
}

const FeatureFlag = ({ flags, children }: Props) => {
  const { wallet } = useAppContext()
  return flags.some(flag => flagConditions[flag](wallet)) ? (
    <>{children}</>
  ) : null
}

export default FeatureFlag
