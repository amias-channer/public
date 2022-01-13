import React, { createContext, FC } from 'react'
import { useMap } from 'react-hanger/array'

type ImagePreviewCacheState = {
  imagePreviewCache: Map<string, string>
  cacheImage: (key: string, value: string) => void
  deleteImage: (keyToRemove: string) => void
}

export const ImagePreviewCacheContext = createContext<ImagePreviewCacheState>({
  imagePreviewCache: new Map(),
  cacheImage: () => {},
  deleteImage: () => {},
})

export const ImagePreviewCacheProvider: FC = ({ children }) => {
  const [imagePreviewCache, imagePreviewCacheActions] = useMap<string, string>()

  return (
    <ImagePreviewCacheContext.Provider
      value={{
        imagePreviewCache,
        cacheImage: imagePreviewCacheActions.set,
        deleteImage: imagePreviewCacheActions.delete,
      }}
    >
      {children}
    </ImagePreviewCacheContext.Provider>
  )
}
