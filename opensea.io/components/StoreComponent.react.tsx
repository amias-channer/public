import { Unsubscribe } from "redux"
import AppComponent from "../AppComponent.react"
import { subscribe, App, getState } from "../store"

export default class StoreComponent<P = {}, S = {}> extends AppComponent<P, S> {
  unsub: Unsubscribe | undefined = undefined
  store: App = getState()

  componentDidMount() {
    this.unsub = subscribe(() => {
      this.store = getState()
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    if (this.unsub) {
      this.unsub()
    }
  }
}
