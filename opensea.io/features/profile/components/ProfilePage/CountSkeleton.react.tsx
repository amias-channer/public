import React from "react"
import Skeleton from "../../../../design-system/Skeleton"

export const CountSkeleton = () => {
  return (
    <Skeleton>
      <Skeleton.Circle variant="full" width="24px" />
    </Skeleton>
  )
}
