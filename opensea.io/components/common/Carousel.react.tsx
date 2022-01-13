import React from "react"
import Slider, { Settings, ResponsiveObject } from "react-slick"
import styled from "styled-components"
import { IS_SERVER } from "../../constants"
import useAppContext from "../../hooks/useAppContext"
import { selectClassNames } from "../../lib/helpers/styling"
import ActionButton from "./ActionButton.react"
import { BREAKPOINTS_PX } from "./MediaQuery.react"

interface Props {
  dots: boolean
  arrows?: boolean
  dotType?: "dot" | "image" | "below"
  className?: string
  slidesToShow?: number
  autoplay?: boolean
  beforeChange?: (oldIndex: number, newIndex: number) => unknown
  afterChange?: (newIndex: number) => unknown
  customPaging?: (i: number) => JSX.Element
  infinite?: boolean
  overflow?: boolean
  autoplaySpeed?: number
  children?: React.ReactNode
  responsive?: boolean | ResponsiveObject[]
}

const Carousel = ({
  afterChange,
  children,
  beforeChange,
  customPaging,
  dots,
  infinite = true,
  slidesToShow = 1,
  autoplay,
  className,
  dotType,
  arrows,
  overflow = false,
  autoplaySpeed = 4000,
  responsive,
}: Props) => {
  const { isMobile } = useAppContext()
  const settings: Settings = {
    dots: dots,
    autoplay: autoplay ?? false,
    slidesToShow: slidesToShow,
    className: selectClassNames(
      "Carousel",
      {
        dot: dotType === "dot",
        image: dotType === "image",
      },
      className,
    ),
    arrows: arrows ?? false,
    lazyLoad: IS_SERVER ? undefined : "ondemand",
    draggable: !(dotType === "image") || !!isMobile,
    autoplaySpeed: autoplaySpeed,
    beforeChange,
    afterChange,
    infinite,
    prevArrow: arrows ? <LeftArrow /> : undefined,
    nextArrow: arrows ? <RightArrow /> : undefined,
    ...(!!customPaging && { customPaging }),
    ...(dotType === "image" && {
      appendDots: function appendDots(dots: React.ReactNode) {
        return (
          <div>
            <div className="Carousel--image-list-container">
              <ul className="Carousel--image-list">{dots}</ul>
            </div>
          </div>
        )
      },
    }),
    responsive: Array.isArray(responsive)
      ? responsive
      : responsive === true
      ? [
          {
            breakpoint: BREAKPOINTS_PX.extraLarge,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: BREAKPOINTS_PX.medium,
            settings: {
              slidesToShow: 1,
              arrows: false,
            },
          },
        ]
      : undefined,
  }
  if (dotType) {
    settings.dotsClass = selectClassNames(
      "Carousel",
      {
        "dot-dots": dotType === "dot",
        "image-dots": dotType === "image",
        "below-dots": dotType === "below",
      },
      dotType === "below" ? "slick-dots" : undefined,
    )
  }

  return (
    <DivContainer $overflow={overflow}>
      <Slider {...settings}>{children}</Slider>
    </DivContainer>
  )
}

export default Carousel

interface ArrowProps {
  onClick?: () => unknown
}

const LeftArrow = ({ onClick }: ArrowProps) => (
  <ActionButton
    className="Carousel--left-arrow"
    icon="chevron_left"
    type="tertiary"
    onClick={onClick}
  />
)

const RightArrow = ({ onClick }: ArrowProps) => (
  <ActionButton
    className="Carousel--right-arrow"
    icon="chevron_right"
    type="tertiary"
    onClick={onClick}
  />
)

const DivContainer = styled.div<{ $overflow: boolean }>`
  height: 100%;
  width: 100%;

  .slick-list {
    overflow: ${props => (props.$overflow ? "visible" : "hidden")};
  }

  .Carousel--below-dots {
    position: initial;
    padding-top: 8px;
  }

  .Carousel--left-arrow {
    position: absolute;
    top: 50%;
    z-index: 1;
    border-radius: 50%;
    left: -25px;

    &:focus {
      outline: 0;
    }
  }

  .Carousel--right-arrow {
    position: absolute;
    top: 50%;
    z-index: 1;
    border-radius: 50%;
    right: -25px;

    &:focus {
      outline: 0;
    }
  }

  .Carousel--image {
    height: 100% !important;

    .Carousel--image-dots {
      height: 104px;
      border-top: 1px solid ${props => props.theme.colors.border};
      display: flex;
      justify-content: space-between;
      align-items: center;

      .Carousel--image-list-container {
        overflow-x: auto;
        overflow-y: hidden;

        .Carousel--image-list {
          margin: 0;
          padding: 10px;
          align-items: center;
          display: flex;
          justify-content: flex-start;

          li {
            cursor: pointer;
            margin: 0px 10px;

            button {
              width: 100%;
              height: 100%;
              background: transparent;
              border-color: transparent;
            }
          }
        }
      }
    }
  }

  .Carousel--dot {
    height: 100% !important;

    .slick-list,
    .slick-track,
    .slick-slide,
    .slick-slide > div {
      height: 100%;
      border-radius: ${props => props.theme.borderRadius.default};
    }

    .Carousel--dot-dots {
      margin: 0 0 0 15px;
      position: relative;
      bottom: 35px;
      height: 25px;
      overflow: hidden;

      li {
        cursor: pointer;
        width: 6px;
        height: 6px;
        font-size: 0px;
        display: inline-block;
        background-color: ${props => props.theme.colors.fog};
        border-radius: 50%;
        border: 1px solid ${props => props.theme.colors.fog};
        margin-right: 6px;

        &:hover {
          background-color: ${props => props.theme.colors.gray};
          border: 1px solid ${props => props.theme.colors.gray};
        }

        button {
          width: 100%;
          height: 100%;
          background: transparent;
          border-color: transparent;

          &:focus {
            outline: initial;
          }
        }
      }

      .slick-active {
        background-color: ${props => props.theme.colors.primary};
      }
    }
  }
`
