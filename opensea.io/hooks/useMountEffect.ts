import { EffectCallback, useEffect } from "react"

/**
 * Run a callback effect only once when the calling component mounts
 * @param effect Effect to be run only on mount
 */
export const useMountEffect = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
