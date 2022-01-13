import React from "react"
import Select, { SelectOption } from "../../design-system/Select"

const DAY_FILTERS = ["7", "14", "30", "60", "90", "365", "All Time"]
export type DayDurationFilter = typeof DAY_FILTERS[number]

interface Props {
  dayDurationFilter: DayDurationFilter
  onChange: (newDayDurationFilter: DayDurationFilter) => unknown
}

export default class PriceHistoryDropdown extends React.Component<Props> {
  toOption: (dayDurationFilter: DayDurationFilter) => SelectOption =
    dayDurationFilter => {
      let label
      if (dayDurationFilter === "All Time") {
        label = "All Time"
      } else if (dayDurationFilter === "365") {
        label = "Last Year"
      } else {
        label = `Last ${dayDurationFilter} Days`
      }

      return {
        label,
        value: `${dayDurationFilter}`,
      }
    }

  render() {
    const { dayDurationFilter, onChange } = this.props
    return (
      <Select
        clearable={false}
        options={DAY_FILTERS.map(this.toOption)}
        readOnly
        value={this.toOption(dayDurationFilter)}
        onSelect={option => option?.value && onChange(option.value)}
      />
    )
  }
}
