type Callback = () => unknown

export default class Publisher {
  private subscriptions: Callback[] = []

  subscribe = (callback: Callback): Callback => {
    this.subscriptions.push(callback)
    return () => {
      this.subscriptions = this.subscriptions.filter(s => s !== callback)
    }
  }

  publish = () => this.subscriptions.forEach(s => s())
}
