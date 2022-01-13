import { getTrackingFn } from "../utils"

export const trackClickCreateCollection = getTrackingFn(
  "click create collection",
)
export const trackAddAuthorizedEditor = getTrackingFn<{ collection: string }>(
  "add authorized editor",
)
export const trackRemoveAuthorizedEditor = getTrackingFn<{
  collection: string
}>("remove authorized editor")
export const trackMoveAssetCollection = getTrackingFn("move asset collection")

export type CollectionSlugParams = {
  collectionSlug: string
}
export const trackCreateCollection =
  getTrackingFn<CollectionSlugParams>("create collection")
export const trackEditCollection = getTrackingFn<
  CollectionSlugParams & { newCollectionSlug?: string }
>("edit collection")
