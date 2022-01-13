import React from "react"
import { HUES } from "../../styles/themes"

interface Props {
  className?: string
  width?: number
  fill?: string
}

const KlaytnLogo = ({ className, fill = HUES.gray, width }: Props) => (
  <svg
    className={className}
    fill={fill}
    style={{ width: width }}
    viewBox="0 0 18 18"
  >
    <path d="M9.04834 9.33492L13.9608 14.2314C15.1669 12.9533 15.9018 11.228 15.9018 9.33492C15.9018 7.44184 15.1669 5.7165 13.9608 4.43848L9.04834 9.33492Z" />
    <path d="M8.70496 9.6709L3.85645 14.5034L8.70496 16.5004L13.5535 14.5034L8.70496 9.6709Z" />
    <path d="M8.52919 9.15934L13.5534 4.15905L8.92857 2.25L4.30371 13.3768L8.52919 9.15934Z" />
    <path d="M1.5 9.33499C1.5 11.2201 2.23487 12.9374 3.42503 14.2155L8.24958 2.60938L1.5 9.33499Z" />
  </svg>
)

export default KlaytnLogo
