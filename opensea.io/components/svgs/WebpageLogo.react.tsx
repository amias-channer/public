import React from "react"
import { HUES } from "../../styles/themes"

interface Props {
  className?: string
  width?: number
  fill?: string
}

const WebpageLogo = ({ className, fill = HUES.gray, width }: Props) => (
  <svg
    className={className}
    fill={fill}
    style={{ width: width }}
    viewBox="0 0 20 16"
  >
    <path d="M17.569.5H2.43C1.39.5.548 1.344.548 2.375l-.01 11.25A1.89 1.89 0 002.43 15.5H17.57a1.89 1.89 0 001.892-1.875V2.375A1.89 1.89 0 0017.57.5zm-4.73 13.125H2.43v-3.75h10.408v3.75zm0-4.688H2.43v-3.75h10.408v3.75zm4.73 4.688h-3.785V5.187h3.785v8.438z" />
  </svg>
)

export default WebpageLogo
