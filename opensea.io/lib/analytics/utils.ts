import analyticsV2 from "./analyticsV2"

/**
 * Get a strongly typed tracking function with event name preset (no params)
 * @param eventName Event name to use for tracking
 * @returns Strongly typed tracking function with event name preset
 */
export function getTrackingFn<_T extends undefined>(
  eventName: string,
): () => void

/**
 * Get a strongly typed tracking function with params and with event name preset
 * @param eventName Event name to use for tracking
 * @returns Strongly typed tracking function with params and with event name preset
 */
export function getTrackingFn<T extends Record<string, unknown>>(
  eventName: string,
): (params: T) => void

// implementation
export function getTrackingFn(
  eventName: string,
): (params?: Record<string, unknown>) => void {
  return (params?: Record<string, unknown>) => {
    analyticsV2.track(eventName, params)
  }
}

/**
 * Get a strongly typed tracking function that takes the event name and params
 * @returns Strongly typed tracking function that takes the event name and params
 */
export function getUnnamedTrackingFn<
  T extends Record<string, unknown>,
  E extends string = string,
>(): (eventName: E, params: T) => void {
  return (eventName, params) => {
    analyticsV2.track(eventName, params)
  }
}

/**
 * Get a strongly page typed tracking function with page name preset (no params)
 * @param pageName Page name to use for tracking
 * @returns Strongly page typed tracking function with page name preset
 */
export function getPageTrackingFn<_T extends undefined>(
  pageName: string,
): () => void

/**
 * Get a strongly page typed tracking function with params and with page name preset
 * @param pageName Page name to use for tracking
 * @returns Strongly page typed tracking function with params and with page name preset
 */
export function getPageTrackingFn<T extends Record<string, unknown>>(
  pageName: string,
): (params: T) => void

// implementation
export function getPageTrackingFn(
  pageName: string,
): (params?: Record<string, unknown>) => void {
  return (params?: Record<string, unknown>) => {
    analyticsV2.page({
      properties: {
        ...params,
        pageName,
        path: window.location.pathname,
      },
    })
  }
}
