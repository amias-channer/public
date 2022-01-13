import React from "react"
import styled from "styled-components"
import Block from "../../design-system/Block"
import Flex from "../../design-system/Flex"
import { selectClassNames } from "../../lib/helpers/styling"
import Image from "./Image.react"
import Link from "./Link.react"

interface Props {
  children: React.ReactNode
  imageUrl: string
  href: string
  imageWidth?: number
  imageHeight?: number
  className?: string
  containerClassName?: string
  contentClassName?: string
  eventSource?: string
}

const CarouselCard = ({
  imageUrl,
  href,
  imageWidth,
  imageHeight,
  containerClassName,
  contentClassName,
  className,
  children,
  eventSource,
}: Props) => {
  return (
    <Container className={containerClassName}>
      <Link
        className={selectClassNames("CarouselCard", { main: true }, className)}
        eventSource={eventSource}
        href={href}
      >
        <Image
          className="CarouselCard--image"
          height={imageHeight}
          sizing="cover"
          url={imageUrl}
          width={imageWidth}
        />
        <Flex
          className={selectClassNames(
            "CarouselCard",
            { content: true },
            contentClassName,
          )}
        >
          {children}
        </Flex>
      </Link>
    </Container>
  )
}

export default CarouselCard

const Container = styled(Block)`
  display: inline-block;
  width: 100%;

  .CarouselCard--main {
    display: inline-block;
    border: 1px solid ${props => props.theme.colors.border};
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.default};
    cursor: pointer;
    width: 100%;

    &:hover {
      box-shadow: ${props => props.theme.shadow};
      transition: 0.1s;
    }

    .CarouselCard--image {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: 1px solid ${props => props.theme.colors.border};
      background-color: ${props => props.theme.colors.border};
    }

    .CarouselCard--content {
      flex-direction: column;
      padding: 10px;
    }
  }
`
