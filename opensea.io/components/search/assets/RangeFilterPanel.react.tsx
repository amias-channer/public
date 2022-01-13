import React from "react"
import { Range as RCSliderRange } from "rc-slider"
import styled from "styled-components"
import { RangeType } from "../../../lib/graphql/__generated__/assetsQuery.graphql"
import { BigNumber, bn } from "../../../lib/helpers/numberUtils"
import { snakeCaseToSentenceCase } from "../../../lib/helpers/stringUtils"
import { MaterialIcon } from "../../common/Icon.react"
import Panel from "../../layout/Panel.react"
import Input from "../../v2/inputs/Input.react"

interface Props {
  activeRange?: RangeType | undefined
  className?: string
  // Comes from DEFAULT_RANGE or from the trait's min and max.
  fullRange: RangeType
  icon: MaterialIcon
  // Allows the numbers below the slider to update in real time as the user drags the sliders.
  realtimeSliderState: RangeType
  // Updates the numbers with every mouse movement.
  setRealtimeSliderState: (selectedRange: RangeType) => unknown
  // Gets passed down from AssetSearch, updates the searchState when you release the mouse click.
  setRange: (range?: RangeType) => unknown
  startOpen: boolean | undefined
  step: BigNumber
  title: string
}

interface State {
  inputRange: RangeType
}

export default class RangeFilterPanel extends React.Component<Props, State> {
  state: State = {
    inputRange: this.props.activeRange || this.props.fullRange,
  }

  componentDidUpdate(prevProps: Props) {
    const { realtimeSliderState } = this.props
    const { min, max } = prevProps.realtimeSliderState
    if (min !== realtimeSliderState.min || max !== realtimeSliderState.max) {
      this.setState({
        inputRange: realtimeSliderState,
      })
    }
  }

  onChangeMin = (min: string): void => {
    this.setState({
      inputRange: {
        ...this.state.inputRange,
        min: parseFloat(min),
      },
    })
  }

  onChangeMax = (max: string): void => {
    this.setState({
      inputRange: {
        ...this.state.inputRange,
        max: parseFloat(max),
      },
    })
  }

  updateSliderRange = (value: RangeType): void => {
    const { activeRange, fullRange, setRealtimeSliderState, setRange } =
      this.props
    this.setState(
      {
        inputRange: value,
      },
      () => {
        if (
          value.min === (activeRange?.min || fullRange.min) &&
          value.max === (activeRange?.max || fullRange.max)
        ) {
          return
        }
        setRealtimeSliderState(value)
        setRange(value)
      },
    )
  }

  onBlurMin = (): void => {
    const { activeRange, fullRange } = this.props
    const { inputRange } = this.state
    this.updateSliderRange({
      ...inputRange,
      min:
        isNaN(inputRange.min) || inputRange.min > inputRange.max
          ? activeRange?.min || fullRange.min
          : Math.max(inputRange.min, fullRange.min),
    })
  }

  onBlurMax = (): void => {
    const { activeRange, fullRange } = this.props
    const { inputRange } = this.state
    this.updateSliderRange({
      ...inputRange,
      max:
        isNaN(inputRange.max) || inputRange.max < inputRange.min
          ? activeRange?.max || fullRange.max
          : Math.min(inputRange.max, fullRange.max),
    })
  }

  render() {
    const {
      activeRange,
      className,
      fullRange,
      icon,
      realtimeSliderState,
      setRealtimeSliderState,
      setRange,
      startOpen,
      step,
      title,
    } = this.props
    const { inputRange } = this.state
    return (
      <DivContainer className={className}>
        <Panel
          icon={icon}
          mode={startOpen ? "start-open" : "start-closed"}
          title={snakeCaseToSentenceCase(title)}
        >
          <div className="RangeFilterPanel--slider">
            <RCSliderRange
              allowCross={false}
              defaultValue={
                activeRange
                  ? [activeRange.min, activeRange.max]
                  : [fullRange.min, fullRange.max]
              }
              max={+bn(fullRange.max).div(step).ceil().times(step)}
              min={+bn(fullRange.min).div(step).floor().times(step)}
              step={+step}
              value={[realtimeSliderState.min, realtimeSliderState.max]}
              onAfterChange={([min, max]) => setRange({ min, max })}
              onChange={([min, max]) => setRealtimeSliderState({ min, max })}
            />
          </div>
          <div className="RangeFilterPanel--range">
            <div className="RangeFilterPanel--limit">
              <div className="RangeFilterPanel--limit-label">min</div>
              <Input
                className="RangeFilterPanel--limit-input-main"
                inputClassName="RangeFilterPanel--limit-input"
                type="number"
                value={inputRange.min.toString()}
                onBlur={this.onBlurMin}
                onChange={this.onChangeMin}
                onSubmit={this.onBlurMin}
              />
            </div>
            <div className="RangeFilterPanel--range-divider">-</div>
            <div className="RangeFilterPanel--limit">
              <div className="RangeFilterPanel--limit-label">max</div>
              <Input
                className="RangeFilterPanel--limit-input-main"
                inputClassName="RangeFilterPanel--limit-input"
                type="number"
                value={inputRange.max.toString()}
                onBlur={this.onBlurMax}
                onChange={this.onChangeMax}
                onSubmit={this.onBlurMax}
              />
            </div>
          </div>
        </Panel>
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  .RangeFilterPanel--slider {
    padding: 0 16px;
  }

  .RangeFilterPanel--range {
    align-items: center;
    display: flex;
    margin-top: 12px;

    .RangeFilterPanel--limit {
      background-color: ${props => props.theme.colors.input};
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 5px;
      flex: 1 0;
      padding: 8px;

      .RangeFilterPanel--limit-label {
        color: ${props => props.theme.colors.text.body};
      }

      .RangeFilterPanel--limit-input-main {
        margin-left: -12px;
        border: none;
      }

      .RangeFilterPanel--limit-input {
        padding: 0;
        height: 30px;
        width: 100%;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        &[type="number"] {
          -moz-appearance: textfield;
        }
      }
    }

    .RangeFilterPanel--range-divider {
      margin: 0 12px;
    }
  }
`
