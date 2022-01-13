import { useCallback } from 'react'

import { FlowViewItemType } from '../appConstants'
import { FlowView } from '../types'

export function useCamera() {
  return useCallback((views: FlowView[]) => {
    const isCameraRequired = views.some(view =>
      (view.items || []).some(
        item => item.type === FlowViewItemType.CameraImage && item.required,
      ),
    )

    if (
      isCameraRequired &&
      !('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)
    ) {
      return false
    }

    return true
  }, [])
}
