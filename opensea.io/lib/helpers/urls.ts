const GOOGLE_MEDIA_REGEX =
  /^https:\/\/\w+.googleusercontent.com\/[A-Za-z0-9_-]+/

// Used to mitigate pixelation in browsers.
// Supports displays that use more pixels that the defined resolution (such as Retina).
const boostImageSize = (size: number) => Math.max(size, Math.min(size * 2, 128))

export const decomposeExternaLink = (url: string) => {
  if (url) {
    if (url.substring(0, 8) === "https://") {
      url = url.substring(8, url.length)
    }
    if (url.substring(0, 7) === "http://") {
      url = url.substring(7, url.length)
    }
    if (url.substring(0, 4) === "www.") {
      url = url.substring(4, url.length)
    }
    if (url.substring(url.length - 1, url.length) === "/") {
      url = url.substring(0, url.length - 1)
    }
    url = url.split("/?")[0]
    url = url.split("?")[0]
  }
  return url
}

// https://developers.google.com/photos/library/guides/access-media-items#image-base-urls
// https://developers.google.com/people/image-sizing
export const resizeImage = (
  imageUrl: string,
  {
    height,
    size,
    width,
    freezeAnimation,
  }: {
    height?: number
    size?: number
    width?: number
    freezeAnimation?: boolean
  },
) => {
  const match = imageUrl.match(GOOGLE_MEDIA_REGEX)
  if (!match) {
    return imageUrl
  }
  return [
    match[0],
    [
      !(height || size || width) ? "s0" : "",
      height ? `h${boostImageSize(height)}` : "",
      size ? `s${boostImageSize(size)}` : "",
      width ? `w${boostImageSize(width)}` : "",
      freezeAnimation ? "k" : "",
    ]
      .filter(x => x)
      .join("-"),
  ]
    .filter(x => x)
    .join("=")
}

export const largeFrozenImage = (imageUrl: string) => {
  return resizeImage(imageUrl, { width: 1400, freezeAnimation: true })
}

export const isVideoUrl = (url: string) =>
  [".webm", ".mp4", ".m4v", ".ogg", ".ogv", ".mov"].some(ext =>
    url.endsWith(ext),
  )

export const isAudioUrl = (url: string) =>
  [".mp3", ".wav", ".oga"].some(ext => url.endsWith(ext))

export const isWebGlUrl = (url: string) =>
  [".gltf", ".glb"].some(ext => url.endsWith(ext))

export const isURL = (str: string): boolean =>
  /^https?:\/\/[\w-=?./#]+$/.test(str)

export const isAnimatableImage = (url: string) =>
  url.endsWith(".gif") || url.endsWith(".svg") || url.endsWith(".png")

export const isImageUrl = (url: string) =>
  isAnimatableImage(url) || url.endsWith(".jpg") || url.endsWith(".jpeg")
