import React from "react"
import moment, { Moment } from "moment"
import { formatDuration } from "../../lib/helpers/datetime"

interface CountdownProps {
  moment: Moment
}

export class Countdown extends React.Component<CountdownProps> {
  interval: number | undefined

  componentDidMount() {
    this.interval = window.setInterval(() => this.forceUpdate(), 1000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  render() {
    const { moment: m } = this.props
    return formatDuration(moment.duration(m.diff(moment.utc())))
  }
}
