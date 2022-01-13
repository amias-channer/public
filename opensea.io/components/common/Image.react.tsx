import React from "react"
import {
  LazyLoadImage,
  LazyLoadComponentProps,
} from "react-lazy-load-image-component"
import styled from "styled-components"
import { variant } from "styled-system"
import Loader, {
  getClosestLoaderSize,
} from "../../design-system/Loader/Loader.react"
import { selectClassNames } from "../../lib/helpers/styling"
import throttle from "../../lib/helpers/throttle"
import { resizeImage } from "../../lib/helpers/urls"

type Variant = "round" | "square"
type Sizing = NonNullable<React.CSSProperties["objectFit"]>

const ANIMATION_DURATION_IN_MILLISECONDS = 400
const DEFAULT_SIZING: Sizing = "contain"
const LOADER_DELAY_IN_MILLISECONDS = 400

export interface ImageProps {
  backgroundColor?: string
  children?: React.ReactNode
  className?: string
  fade?: boolean
  height?: number
  variant?: Variant
  isSpinnerShown?: boolean
  onClick?: () => unknown
  size?: number
  sizing?: Sizing
  style?: React.CSSProperties
  imgStyle?: LazyLoadComponentProps["style"]
  url?: string
  width?: number
  alt?: string
}

interface State {
  containerHeight?: number
  isImageLoaded: boolean
  isImageLoaderDisplayed: boolean
  isImageLoaderVisible: boolean
}

export default class Image extends React.Component<ImageProps, State> {
  containerRef: HTMLDivElement | null = null
  imgRef: HTMLImageElement | null = null
  loaderDisplayTimeout?: number
  loaderTimeout?: number
  loadTimeout?: number

  state: State = {
    isImageLoaded: false,
    isImageLoaderDisplayed: true,
    isImageLoaderVisible: false,
  }

  onLoad = () =>
    this.setState({ isImageLoaded: true }, () => {
      this.loadTimeout = window.setTimeout(
        () => this.setState({ isImageLoaderDisplayed: false }),
        ANIMATION_DURATION_IN_MILLISECONDS,
      )
    })

  onResize = throttle(() =>
    this.setState({
      containerHeight: this.containerRef?.clientHeight,
    }),
  )

  componentDidMount() {
    this.onResize()
    window.addEventListener("resize", this.onResize)
    if (this.imgRef?.complete) {
      this.onLoad()
      return
    }
    this.loaderTimeout = window.setTimeout(() => {
      if (!this.imgRef?.complete) {
        this.setState({ isImageLoaderVisible: true })
      }
    }, LOADER_DELAY_IN_MILLISECONDS)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize)
    clearTimeout(this.loadTimeout)
    clearTimeout(this.loaderDisplayTimeout)
    clearTimeout(this.loaderTimeout)
  }

  render() {
    const {
      backgroundColor,
      children,
      className,
      fade,
      height,
      variant = "square",
      isSpinnerShown,
      onClick,
      size,
      sizing,
      style,
      url,
      width,
      imgStyle,
      alt,
    } = this.props
    const {
      containerHeight,
      isImageLoaded,
      isImageLoaderDisplayed,
      isImageLoaderVisible,
    } = this.state
    const resizedUrl = url && resizeImage(url, { height, size, width })
    const loaderSize =
      (size || height || width || containerHeight || 256) * 0.15
    const closestLoaderSize = getClosestLoaderSize(loaderSize)

    return (
      <DivContainer
        className={selectClassNames(
          "Image",
          { fade, isImageLoaded, isImageLoaderDisplayed, isImageLoaderVisible },
          className,
        )}
        ref={ref => (this.containerRef = ref)}
        style={{
          backgroundColor,
          height: height || size || "100%",
          width: width || size || "100%",
          ...style,
        }}
        variant={variant}
      >
        {isSpinnerShown && isImageLoaderDisplayed ? (
          <div className="Image--loader">
            <Loader size={closestLoaderSize} />
          </div>
        ) : null}
        {resizedUrl ? (
          <LazyLoadImage
            afterLoad={this.onLoad}
            alt={alt}
            className="Image--image"
            src={resizedUrl}
            style={{ objectFit: sizing || DEFAULT_SIZING, ...imgStyle }}
            onClick={onClick}
          />
        ) : null}

        {children && <div className="Image--content">{children}</div>}
      </DivContainer>
    )
  }
}

const DivContainer = styled.div<{ variant: Variant }>`
  align-items: center;
  display: flex;
  justify-content: center;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;

  ${props =>
    variant({
      variants: {
        round: {
          borderRadius: props.theme.borderRadius.circle,
        },
        square: {
          borderRadius: props.theme.borderRadius.default,
        },
      },
    })}

  .Image--loader {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: opacity ${ANIMATION_DURATION_IN_MILLISECONDS}ms ease;
    width: 100%;
  }

  .Image--image {
    height: 100%;
    object-fit: contain;
    transition: opacity ${ANIMATION_DURATION_IN_MILLISECONDS}ms ease;
    width: 100%;
  }

  .Image--content {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  &.Image--fade {
    .Image--image {
      opacity: 0;
    }

    &.Image--isImageLoaded {
      .Image--image {
        opacity: 1;
      }
    }
  }

  &.Image--isImageLoaderVisible {
    .Image--loader {
      opacity: 1;
    }
  }

  &.Image--isImageLoaded {
    .Image--loader {
      opacity: 0;
    }
  }
`
