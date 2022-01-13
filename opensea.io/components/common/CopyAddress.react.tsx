import React from "react"
import Block from "../../design-system/Block"
import { trackCopyAddress } from "../../lib/analytics/events/appEvents"
import { truncateAddress } from "../../lib/helpers/addresses"
import Icon from "./Icon.react"
import TextCopier from "./TextCopier.react"

interface Props {
  address: string
  className?: string
}

const CopyAddress = ({ address, className }: Props) => (
  <TextCopier
    className={className}
    text={address}
    onCopy={() => trackCopyAddress()}
  >
    <Block marginRight="8px">{truncateAddress(address)}</Block>
    <Icon size={16} value="content_copy" />
  </TextCopier>
)

export default CopyAddress
