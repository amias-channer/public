import React from "react"
import _ from "lodash"
import { RangeType } from "../../../lib/graphql/__generated__/assetsQuery.graphql"
import { NumericTraitFilter_data } from "../../../lib/graphql/__generated__/NumericTraitFilter_data.graphql"
import { graphql, fragmentize } from "../../../lib/graphql/graphql"
import { bn } from "../../../lib/helpers/numberUtils"
import RangeFilterPanel from "./RangeFilterPanel.react"

const MIN_STEPS = 100

interface Props {
  className?: string
  data: NumericTraitFilter_data
  range?: RangeType
  setRange: (range?: RangeType) => unknown
}

type State = RangeType

class NumericTraitFilter extends React.Component<Props, State> {
  state: State = this.props.range || this.props.data.value

  componentDidUpdate(prevProps: Props) {
    const { data, range } = this.props
    // Initializing the range slider state value when clear the pills in AssetSearchPill
    if (!_.isEqual(range, prevProps.range) && range === undefined) {
      this.setState(data.value)
    }
  }

  render() {
    const { className, data, range, setRange } = this.props
    const { key, value } = data
    const step =
      value.min === value.max
        ? bn(1)
        : bn(10)
            .toPower(
              Math.floor(Math.log10(+bn(value.max).minus(bn(value.min)))),
            )
            .div(MIN_STEPS)
    return (
      <RangeFilterPanel
        activeRange={range}
        className={className}
        fullRange={value}
        icon="bar_chart"
        realtimeSliderState={{ min: this.state.min, max: this.state.max }}
        setRange={setRange}
        setRealtimeSliderState={(selectedRange: RangeType) =>
          this.setState(selectedRange)
        }
        startOpen={false}
        step={step}
        title={key}
      />
    )
  }
}

export default fragmentize(NumericTraitFilter, {
  fragments: {
    data: graphql`
      fragment NumericTraitFilter_data on NumericTraitTypePair {
        key
        value {
          max
          min
        }
      }
    `,
  },
})
