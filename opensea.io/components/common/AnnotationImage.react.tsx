import React, { forwardRef } from "react"
import styled from "styled-components"
import { HUES } from "../../styles/themes"
import Icon, { MaterialIcon, MaterialTheme } from "./Icon.react"
import Image from "./Image.react"

export interface Props {
  icon?: MaterialIcon
  hoverColor?: string
  variant?: MaterialTheme
  imageUrl?: string
  iconSize?: number
  className?: string
}

export const AnnotationImage = forwardRef<HTMLDivElement, Props>(
  function AnnotationImage(
    {
      icon,
      hoverColor = HUES.gray,
      variant = "outlined",
      className,
      iconSize = 18,
      imageUrl,
    },
    ref,
  ) {
    return (
      <DivContainer className={className} hoverColor={hoverColor} ref={ref}>
        {imageUrl ? <Image size={iconSize} url={imageUrl} /> : null}
        {icon ? (
          <Icon
            className="Annotation--icon"
            size={iconSize}
            value={icon}
            variant={variant}
          />
        ) : null}
      </DivContainer>
    )
  },
)

export default AnnotationImage

const DivContainer = styled.div<{ hoverColor: string }>`
  width: fit-content;
  display: flex;
  justify-content: space-around;
  margin-right: 6px;

  .Annotation--icon {
    color: ${props => props.theme.colors.gray};
    &:hover {
      color: ${p => p.hoverColor};
    }
  }
`
