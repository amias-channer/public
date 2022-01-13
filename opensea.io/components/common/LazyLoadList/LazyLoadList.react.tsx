import React from "react"
import { range } from "lodash"
import { LoadMoreFn } from "react-relay"
import { OperationType } from "relay-runtime"
import Block, { BlockProps } from "../../../design-system/Block"
import { FramedList } from "../../../design-system/List"
import Loader from "../../../design-system/Loader/Loader.react"
import ScrollingPaginator from "../../../design-system/ScrollingPaginator"
import { useCallbackRef } from "../../../hooks/useCallbackRef"
import CenterAligned from "../CenterAligned.react"

type Props<TQuery extends OperationType> = {
  pageSize: number
  itemHeight: number
  pagination: {
    isLoadingNext: boolean
    hasNext: boolean
    loadNext: LoadMoreFn<TQuery>
  }
  overrides?: { Root?: { props: BlockProps } }
  children: React.ReactNode
}

function LazyLoadListBase<TQuery extends OperationType>({
  pageSize,
  itemHeight,
  overrides,
  pagination: { hasNext, isLoadingNext, loadNext },
  children,
}: Props<TQuery>) {
  const [contentRef, setContentRef] = useCallbackRef<HTMLDivElement>()
  return (
    <Block ref={setContentRef} {...overrides?.Root?.props}>
      <FramedList>{children}</FramedList>
      <ScrollingPaginator
        intersectionOptions={{
          root: contentRef.current,
          rootMargin: `${itemHeight * 8}px`,
        }}
        page={{
          loadMore: count =>
            new Promise<void>((resolve, reject) => {
              loadNext(count, {
                onComplete: err => {
                  !err ? resolve() : reject(err)
                },
              })
            }),
          isLoading: () => isLoadingNext,
          hasMore: () => hasNext,
        }}
        size={pageSize}
      >
        <CenterAligned height={`${itemHeight}px`}>
          <Loader />
        </CenterAligned>
      </ScrollingPaginator>
    </Block>
  )
}

type LazyLoadListSkeletonProps = {
  pageSize: number
  renderItem: (index: number) => React.ReactNode
  count?: number
  overrides?: { Root?: { props: BlockProps } }
}

const LazyLoadListSkeleton = ({
  count,
  pageSize,
  overrides,
  renderItem,
}: LazyLoadListSkeletonProps) => {
  return (
    <Block {...overrides?.Root?.props}>
      <FramedList>
        {range(Math.min(pageSize, count ?? pageSize)).map(index =>
          renderItem(index),
        )}
      </FramedList>
    </Block>
  )
}

export const LazyLoadList = Object.assign(LazyLoadListBase, {
  Skeleton: LazyLoadListSkeleton,
})

export default LazyLoadList
