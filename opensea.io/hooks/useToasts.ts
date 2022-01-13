import { useCallback } from "react"
import type { ToastT } from "../design-system/Toast"
import { captureNoncriticalError } from "../lib/analytics/analytics"
import { maybeGetGraphQLResponseErrors } from "../lib/graphql/error"
import { Promiseable } from "../lib/helpers/promise"
import useAppContext from "./useAppContext"

export const useToasts = () => {
  const { toasts, updateContext } = useAppContext()

  const addToasts = useCallback(
    (toastElements: ToastT[]) =>
      updateContext({
        toasts: toastElements.reduce(
          (toast, toastElement) => toast.add(toastElement),
          toasts,
        ),
      }),
    [toasts, updateContext],
  )

  const showErrorMessages = useCallback(
    (messages: string[]) =>
      addToasts(
        messages.map(message => ({
          icon: "error",
          key: message,
          title: message,
          variant: "error",
        })),
      ),
    [addToasts],
  )

  const showErrorMessage = useCallback(
    (message: string) => showErrorMessages([message]),
    [showErrorMessages],
  )

  const showSuccessMessage = useCallback(
    (message: string, icon?: ToastT["icon"]) =>
      addToasts([
        {
          icon: icon ?? "check_circle_outline",
          key: message,
          title: message,
          variant: "success",
        },
      ]),
    [addToasts],
  )

  const showWarningMessage = useCallback(
    (message: string, icon?: ToastT["icon"]) =>
      addToasts([
        {
          icon: icon ?? "warning",
          key: message,
          title: message,
          variant: "warning",
        },
      ]),
    [addToasts],
  )

  const attempt = useCallback(
    async (
      callback: () => Promiseable<unknown>,
      { rethrow = false }: { rethrow?: boolean } = {},
    ) => {
      try {
        await callback()
      } catch (error) {
        captureNoncriticalError(error)

        if (!(error instanceof Error)) {
          throw error
        }

        const responseErrors = maybeGetGraphQLResponseErrors(error)
        await showErrorMessages(
          (responseErrors.length ? responseErrors : [error]).map(
            e => e.message,
          ),
        )
        if (rethrow) {
          throw error
        }
      }
    },
    [showErrorMessages],
  )

  return {
    showErrorMessages,
    showErrorMessage,
    showSuccessMessage,
    showWarningMessage,
    attempt,
  }
}

export default useToasts
