import React, { useEffect, useState } from "react"
import { useInView, IntersectionOptions } from "react-intersection-observer"
import CenterAligned from "../../components/common/CenterAligned.react"
import { IS_SERVER } from "../../constants"
import { PageProps } from "../../lib/graphql/graphql"
import Block from "../Block"
import Loader from "../Loader/Loader.react"

export type ScrollingPaginatorProps = {
  intersectionOptions?: IntersectionOptions
  isFirstPageLoading?: boolean
  disableLoader?: boolean
  page: PageProps
  size: number
  children?: React.ReactNode
  onLoad?: () => unknown
  onLoadStart?: () => unknown
}

async function loadPolyfills() {
  if (typeof window.IntersectionObserver === "undefined") {
    await import("intersection-observer")
  }
}

if (!IS_SERVER) {
  loadPolyfills()
}

export const ScrollingPaginator = ({
  disableLoader,
  isFirstPageLoading,
  intersectionOptions,
  page: { hasMore, loadMore, isLoading: getIsPageLoading },
  children,
  onLoad,
  onLoadStart,
  size,
}: ScrollingPaginatorProps) => {
  const { ref, inView } = useInView(intersectionOptions)
  const [isLoading, setIsLoading] = useState(false)

  const isPageLoading = getIsPageLoading()
  const pageHasMore = hasMore()

  const paginate = async () => {
    if (onLoadStart) {
      onLoadStart()
    }
    setIsLoading(true)
    await loadMore(size)
    setIsLoading(false)
    if (onLoad) {
      onLoad()
    }
  }

  useEffect(() => {
    if (inView && pageHasMore && !isLoading && !isPageLoading) {
      paginate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, pageHasMore, isLoading, isPageLoading])

  const renderContent = () => {
    if (!isLoading && !isFirstPageLoading) {
      return null
    }
    if (children) {
      return children
    }
    if (!disableLoader || isFirstPageLoading) {
      return (
        <Block margin="8px">
          <Loader />
        </Block>
      )
    }
    return null
  }

  return <CenterAligned ref={ref}>{renderContent()}</CenterAligned>
}

export default ScrollingPaginator
