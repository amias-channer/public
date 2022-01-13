import React, { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { LazyLoadComponentProps } from "react-lazy-load-image-component"
import styled from "styled-components"
import { DELISTED_IMAGE, PLACEHOLDER_IMAGE } from "../../constants"
import { useTheme } from "../../design-system/Context/ThemeContext"
import {
  AssetMedia_asset,
  CardDisplayStyle,
} from "../../lib/graphql/__generated__/AssetMedia_asset.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { selectClassNames } from "../../lib/helpers/styling"
import {
  isAnimatableImage,
  isAudioUrl,
  isVideoUrl,
  isWebGlUrl,
} from "../../lib/helpers/urls"
import { themeVariant } from "../../styles/styleUtils"
import CenterAligned from "../common/CenterAligned.react"
import Icon from "../common/Icon.react"
import Image from "../common/Image.react"

const DynamicModelScene = dynamic(() => import("../viz/ModelScene.react"), {
  ssr: false,
})

const embedYouTubeUrl = (url: string): string =>
  url
    .replace("youtu.be/", "www.youtube.com/watch?v=")
    .replace(
      /\/watch\?v=([A-Za-z0-9_-]+\??)/,
      "/embed/$1?autoplay=1&controls=0&loop=1&playlist=$1&",
    )

const isYoutubeUrl = (url: string) =>
  url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)

interface Props {
  asset: AssetMedia_asset
  className?: string
  size?: number
  isMuted?: boolean
  title?: string
  autoPlay?: boolean
  useCustomPlayButton?: boolean
  showControls?: boolean
  showModel?: boolean
  mediaStyles?: LazyLoadComponentProps["style"]
  backgroundColor?: string
  alt?: string
  width?: number
}

export const AssetMedia = ({
  asset,
  autoPlay,
  useCustomPlayButton,
  isMuted,
  showModel,
  showControls,
  mediaStyles,
  size,
  alt,
  className,
  title,
  width,
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement & HTMLVideoElement>(null)
  const { theme } = useTheme()

  const renderPlayButton = () => {
    return !autoPlay && useCustomPlayButton ? (
      <Icon
        className="AssetMedia--play-icon"
        size={24}
        value={isPlaying ? "pause" : "play_arrow"}
        onClick={e => {
          e.preventDefault()
          isPlaying ? audioRef.current?.pause() : audioRef.current?.play()
          setIsPlaying(prev => !prev)
        }}
      />
    ) : null
  }

  const renderAnimationOrVideo = ({
    animationUrl,
    imagePreviewUrl,
    cardDisplayStyle,
  }: {
    animationUrl: string
    imagePreviewUrl?: string
    cardDisplayStyle: CardDisplayStyle
  }) => {
    const showVideo = autoPlay || isPlaying || !imagePreviewUrl

    return (
      <div className="AssetMedia--animation">
        {isWebGlUrl(animationUrl) ? (
          showModel ? (
            <DynamicModelScene url={animationUrl} />
          ) : imagePreviewUrl ? (
            renderImage(imagePreviewUrl, cardDisplayStyle)
          ) : null
        ) : isVideoUrl(animationUrl) ? (
          <CenterAligned
            className="AssetMedia--playback-wrapper"
            onContextMenu={e => e.preventDefault()}
          >
            {showVideo ? (
              <video
                autoPlay={showVideo}
                className="AssetMedia--video"
                controls={showControls}
                controlsList="nodownload"
                loop
                muted={isMuted || !imagePreviewUrl}
                playsInline
                poster={imagePreviewUrl}
                src={animationUrl}
                style={mediaStyles}
              />
            ) : imagePreviewUrl ? (
              renderImage(imagePreviewUrl, cardDisplayStyle)
            ) : null}
          </CenterAligned>
        ) : (
          <>
            {showVideo ? (
              <iframe
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                height="100%"
                sandbox={`${
                  // YouTube needs access to cookies in order for iframe to work.
                  // This is unsafe otherwise
                  isYoutubeUrl(animationUrl) ? "allow-same-origin " : ""
                }allow-scripts`}
                src={embedYouTubeUrl(animationUrl)}
                style={{ minHeight: "inherit" }}
                width="100%"
              />
            ) : imagePreviewUrl ? (
              renderImage(imagePreviewUrl, cardDisplayStyle)
            ) : null}
          </>
        )}
        {isWebGlUrl(animationUrl) ||
        !imagePreviewUrl ||
        // Normal interactive iFrame shouldn't show the play button
        (!isVideoUrl(animationUrl) && !isYoutubeUrl(animationUrl))
          ? null
          : renderPlayButton()}
      </div>
    )
  }

  const renderAudio = (
    url: string,
    imageUrl: string,
    cardDisplayStyle: CardDisplayStyle,
  ) => {
    return (
      <div className="AssetMedia--animation">
        <div
          className="AssetMedia--playback-wrapper"
          onContextMenu={e => e.preventDefault()}
        >
          {renderImage(imageUrl, cardDisplayStyle)}
          <audio
            autoPlay={autoPlay}
            className="AssetMedia--audio"
            controls={showControls}
            controlsList="nodownload"
            loop
            muted={isMuted}
            preload="none"
            ref={audioRef}
            src={url}
          />
          {renderPlayButton()}
        </div>
      </div>
    )
  }

  const renderImage = (url: string, cardDisplayStyle: CardDisplayStyle) => {
    const sizing =
      cardDisplayStyle === "COVER"
        ? "cover"
        : cardDisplayStyle === "CONTAIN"
        ? "contain"
        : undefined

    return (
      <Image
        alt={alt}
        className={selectClassNames("AssetMedia", {
          img: true,
          invert: theme === "dark" && url === PLACEHOLDER_IMAGE,
        })}
        fade
        imgStyle={{
          width: sizing === "cover" ? "100%" : "auto",
          height: sizing === "cover" ? "100%" : "auto",
          borderRadius: sizing === "cover" ? "initial" : "5px",
          maxWidth: "100%",
          maxHeight: "100%",
          ...mediaStyles,
        }}
        isSpinnerShown
        size={size}
        sizing={sizing}
        url={url}
        width={width}
      />
    )
  }

  const { animationUrl, collection, imageUrl } = asset
  const cardDisplayStyle = collection.displayData?.cardDisplayStyle ?? "CONTAIN"
  const computedAnimationUrl =
    animationUrl && !isAnimatableImage(animationUrl)
      ? animationUrl
      : imageUrl && isVideoUrl(imageUrl)
      ? imageUrl
      : undefined
  const computedAudioUrl =
    animationUrl && isAudioUrl(animationUrl) ? animationUrl : undefined

  const computedImageUrl =
    animationUrl && isAnimatableImage(animationUrl)
      ? animationUrl
      : imageUrl || collection?.imageUrl || PLACEHOLDER_IMAGE

  let content
  if (asset.isDelisted) {
    return (
      <Image
        className={selectClassNames("AssetMedia", {
          img: true,
          invert: theme === "dark",
        })}
        fade
        imgStyle={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        size={size}
        sizing={"cover"}
        url={DELISTED_IMAGE}
        width={width}
      />
    )
  } else if (computedAudioUrl && computedImageUrl) {
    content = renderAudio(computedAudioUrl, computedImageUrl, cardDisplayStyle)
    // Handles the case where some assets use a video as the image url
  } else if (isVideoUrl(computedImageUrl)) {
    content = renderAnimationOrVideo({
      animationUrl: computedImageUrl,
      cardDisplayStyle,
    })
  } else if (computedAnimationUrl) {
    content = renderAnimationOrVideo({
      animationUrl: computedAnimationUrl,
      imagePreviewUrl: computedImageUrl,
      cardDisplayStyle,
    })
  } else {
    content = renderImage(computedImageUrl, cardDisplayStyle)
  }

  return (
    <DivContainer className={className} title={title}>
      <CenterAligned
        borderRadius="inherit"
        height="100%"
        minHeight="inherit"
        style={{
          padding: cardDisplayStyle === "PADDED" ? "8px" : undefined,
        }}
        width="100%"
      >
        {content}
      </CenterAligned>
    </DivContainer>
  )
}

export default fragmentize(AssetMedia, {
  fragments: {
    asset: graphql`
      fragment AssetMedia_asset on AssetType {
        animationUrl
        backgroundColor
        collection {
          description
          displayData {
            cardDisplayStyle
          }
          imageUrl
          hidden
          name
          slug
        }
        description
        name
        tokenId
        imageUrl
        isDelisted
      }
    `,
  },
})

const DivContainer = styled.div`
  min-height: inherit;
  border-radius: inherit;
  height: 100%;
  width: 100%;

  .AssetMedia--animation {
    position: relative;
    min-height: inherit;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
    border-radius: inherit;

    .AssetMedia--playback-wrapper {
      height: 100%;
      width: 100%;
      border-radius: inherit;

      .AssetMedia--audio {
        width: 100%;
        outline: none;
      }

      .AssetMedia--video {
        height: 100%;
        width: 100%;
      }

      > img {
        ${themeVariant({
          variants: {
            light: {
              borderRadius: "inherit",
            },
          },
        })}
      }
    }
  }

  .AssetMedia--play-icon,
  .AssetMedia--play-shadow {
    position: absolute;
  }

  .AssetMedia--play-icon {
    align-items: center;
    border-radius: 50%;
    border: 1px solid ${props => props.theme.colors.border};
    display: flex;
    height: 32px;
    justify-content: center;
    bottom: 8px;
    right: 8px;
    width: 32px;

    ${props =>
      themeVariant({
        variants: {
          light: {
            color: props.theme.colors.gray,
            backgroundColor: props.theme.colors.white,
            "&:hover": {
              color: props.theme.colors.oil,
            },
          },
          dark: {
            color: props.theme.colors.fog,
            backgroundColor: props.theme.colors.oil,
            "&:hover": {
              color: props.theme.colors.white,
              backgroundColor: props.theme.colors.ash,
            },
          },
        },
      })}

    &:hover {
      box-shadow: ${props => props.theme.shadow};
    }
  }

  .AssetMedia--play-shadow {
    width: 26px;
    height: 26px;
    right: 11px;
    bottom: 11px;
    border-radius: 50%;
    box-shadow: ${props => props.theme.shadow};
    pointer-events: none;
  }

  .AssetMedia--img {
    ${themeVariant({
      variants: {
        light: {
          borderRadius: "inherit",
        },
      },
    })}

    > img {
      ${themeVariant({
        variants: {
          light: {
            borderRadius: "inherit",
          },
        },
      })}
    }
  }

  .AssetMedia--invert {
    filter: grayscale(1) invert(1);
  }
`
