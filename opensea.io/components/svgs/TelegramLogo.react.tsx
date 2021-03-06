import React from "react"
import { HUES } from "../../styles/themes"

interface Props {
  className?: string
  width?: number
  fill?: string
}

const TelegramLogo = ({ className, fill = HUES.gray, width }: Props) => (
  <svg
    className={className}
    fill={fill}
    style={{ width: `${width}px` }}
    viewBox="0 0 24 16"
  >
    <path
      clipRule="evenodd"
      d="M18.28 15.456c.317.168.725.21 1.09.107.363-.104.631-.337.712-.62.854-3.013 2.928-10.64 3.706-13.38.06-.207-.04-.421-.256-.56A1 1 0 0022.748.9C18.625 2.045 5.921 5.62.729 7.06c-.329.092-.543.33-.532.59.012.262.246.488.583.564 2.329.522 5.385 1.25 5.385 1.25s1.428 3.234 2.173 4.88c.093.206.309.369.593.425.283.055.586-.003.798-.153l3.046-2.157s3.513 1.933 5.506 2.997zM7.45 9.054L9.1 13.14l.367-2.587 10.02-6.778c.106-.072.12-.193.032-.278-.088-.085-.249-.104-.37-.047L7.45 9.054z"
      fillRule="evenodd"
    />
  </svg>
)

export default TelegramLogo
