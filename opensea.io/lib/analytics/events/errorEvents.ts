import { getTrackingFn } from "../utils"

export const trackShowError =
  getTrackingFn<{ message: string; path?: string }>("show error")
