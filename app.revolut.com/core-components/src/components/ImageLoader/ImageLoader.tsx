import noop from 'lodash/noop'
import { FC, useEffect, useState, useRef, ReactNode } from 'react'
import { Relative } from '@revolut/ui-kit'
import * as Sentry from '@sentry/react'

import { SpinnerStyled } from './styled'

type ImageLoaderProps = {
  loader?: ReactNode
  src: string
}

export enum ImageLoaderTestId {
  Spinner = 'ImageLoaderSpinner',
}

export const ImageLoader: FC<ImageLoaderProps> = ({ children, loader, src }) => {
  const loadedSrc = useRef('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (loadedSrc.current !== src) {
      const delaySpinnerAppearance = () => {
        return setTimeout(() => {
          setIsLoaded(false)
        }, 500)
      }

      const timer = delaySpinnerAppearance()

      const handleImageLoaded = () => {
        clearTimeout(timer)
        setIsLoaded(true)

        loadedSrc.current = src
      }

      const img = new Image()

      img.src = src
      img.onload = handleImageLoaded
      img.onerror = () => {
        handleImageLoaded()
        Sentry.captureException(new Error(`failed to load image from source: ${src}`))
      }

      return () => {
        img.onload = null
        img.onerror = null
      }
    }

    return noop
  }, [src])

  return (
    <>
      {isLoaded
        ? children
        : loader ?? (
            <Relative data-testid={ImageLoaderTestId.Spinner}>
              <SpinnerStyled size={24} color="blue" />
            </Relative>
          )}
    </>
  )
}
