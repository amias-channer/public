import React from "react"

interface Props {
  interval: number
  renderFormattedTimestamp: () => string
}

export default class LiveTimestamp extends React.Component<Props> {
  updateInterval: number | undefined

  static defaultProps = {
    interval: 1000,
  }

  componentDidMount() {
    const { interval } = this.props

    this.updateInterval = window.setInterval(() => {
      this.forceUpdate()
    }, interval)
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval)
  }

  render() {
    const { renderFormattedTimestamp } = this.props

    return <>{renderFormattedTimestamp()}</>
  }
}
