export default class Subject<T> {
  observers: Array<[(value: T) => void, (error: any) => void]> = []
  isPending = false

  begin(): void {
    this.isPending = true
  }

  observe(): Promise<T> {
    return new Promise((resolve, reject) =>
      this.observers.push([resolve, reject]),
    )
  }

  resolve(value: T): void {
    this.observers.forEach(([resolve]) => resolve(value))
    this.observers = []
    this.isPending = false
  }

  reject(error: any): void {
    this.observers.forEach(([, reject]) => reject(error))
    this.observers = []
    this.isPending = false
  }
}
