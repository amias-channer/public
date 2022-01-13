import React, { Component } from "react"
import {
  DEFAULT_APP_CONTEXT,
  AppContext,
  AppContextProps,
  AppContextType,
} from "./AppContext"
import { useWallet } from "./containers/WalletProvider.react"
import { useTheme } from "./design-system/Context/ThemeContext"
import type { ToastT } from "./design-system/Toast"
import I18n from "./i18n/i18n"
import { maybeGetGraphQLResponseErrors } from "./lib/graphql/error"
import type { Promiseable } from "./lib/helpers/promise"

interface Props {
  children: React.ReactNode
  value: AppContextProps
}

export const AppContextProvider = ({
  children,
  value = DEFAULT_APP_CONTEXT,
}: Props) => {
  const { theme } = useTheme()
  const { chain } = useWallet()
  return (
    <AppContext.Provider value={{ ...value, theme, chain }}>
      {children}
    </AppContext.Provider>
  )
}

// DEPRECATED: use hooks instead
export default class AppComponent<Props = {}, State = {}> extends Component<
  Props,
  State
> {
  static contextType = AppContext
  context!: AppContextType

  private async addToasts(toastElements: ToastT[]): Promise<void> {
    const { toasts, updateContext } = this.context
    await updateContext({
      toasts: toastElements.reduce(
        (toast, toastElement) => toast.add(toastElement),
        toasts,
      ),
    })
  }

  async showErrorMessages(messages: string[]): Promise<void> {
    await this.addToasts(
      messages.map(message => ({
        icon: "error",
        key: message,
        title: message,
        variant: "error",
      })),
    )
  }

  async showErrorMessage(message: string): Promise<void> {
    await this.showErrorMessages([message])
  }

  async showSuccessMessage(
    message: string,
    icon?: ToastT["icon"],
  ): Promise<void> {
    await this.addToasts([
      {
        icon: icon ?? "check_circle_outline",
        key: message,
        title: message,
        variant: "success",
      },
    ])
  }

  async showWarningMessage(
    message: string,
    icon?: ToastT["icon"],
  ): Promise<void> {
    await this.addToasts([
      {
        icon: icon ?? "warning",
        key: message,
        title: message,
        variant: "warning",
      },
    ])
  }

  async attempt(callback: () => Promiseable<unknown>): Promise<void> {
    try {
      await callback()
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }
      const responseErrors = maybeGetGraphQLResponseErrors(error)
      await this.showErrorMessages(
        (responseErrors.length ? responseErrors : [error]).map(e => e.message),
      )
    }
  }

  tr(text: string): string {
    const { language } = this.context
    const result = I18n.tr(language, text)[0]
    return typeof result === "string" ? result : text
  }

  update<K extends keyof State>(
    state: Pick<State, K> | ((state: State, props: Props) => Pick<State, K>),
  ): Promise<void> {
    return new Promise(resolve => this.setState(state, resolve))
  }

  isStaff(): boolean {
    const { wallet } = this.context
    return wallet.isStaff
  }
}
