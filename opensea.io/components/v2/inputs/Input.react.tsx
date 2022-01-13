import React from "react"
import styled from "styled-components"
import AppComponent from "../../../AppComponent.react"
import Loader from "../../../design-system/Loader/Loader.react"
import { appendClassName, selectClassNames } from "../../../lib/helpers/styling"
import { themeVariant } from "../../../styles/styleUtils"
import Icon from "../../common/Icon.react"
import { FrameConsumer, FrameProvider } from "../../layout/Frame.react"

export type InputStatus = "standby" | "wait" | "valid" | "invalid"

export type Props = {
  containerClassName?: string
  errorInfo?: string
  isRequired?: boolean
  inputClassName?: string
  onBlur?: () => unknown
  onChange: (value: string) => unknown
  onSubmit?: (value: string) => unknown
  prefix?: string
  right?: React.ReactNode
  status?: InputStatus
  value: string
  valueInfo?: string
} & Pick<
  JSX.IntrinsicElements["input"],
  | "children"
  | "className"
  | "disabled"
  | "inputMode"
  | "placeholder"
  | "type"
  | "name"
  | "min"
  | "max"
  | "id"
  | "autoFocus"
>

interface State {
  isRequirementErrorShown?: boolean
}

// DEPRECATED: use design-sytem/Input instead
class Input extends AppComponent<Props> {
  static defaultProps = {
    className: "",
  }

  input: HTMLInputElement | null = null
  state: State = {}

  render() {
    const {
      children,
      className,
      containerClassName,
      disabled,
      errorInfo,
      inputClassName,
      inputMode,
      isRequired,
      min,
      max,
      onBlur,
      onChange,
      onSubmit,
      placeholder,
      prefix,
      right,
      status,
      type,
      value,
      valueInfo,
      name,
      id,
      autoFocus,
    } = this.props
    const { isRequirementErrorShown } = this.state
    return (
      <FrameConsumer>
        {({ isFramed }) => (
          <DivContainer
            className={selectClassNames(
              "Input",
              {
                framed: isFramed,
                invalid: status === "invalid" || isRequirementErrorShown,
                valid: status === "valid",
                disabled,
              },
              containerClassName,
            )}
          >
            <div className={appendClassName("Input--main", className)}>
              {children ? (
                <FrameProvider className="Input--label Input--left-label">
                  {children}
                </FrameProvider>
              ) : undefined}
              <div
                className="Input--prefix"
                onClick={() => this.input?.focus()}
              >
                {prefix}
              </div>
              <input
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                autoFocus={autoFocus}
                className={appendClassName(
                  "browser-default Input--input",
                  inputClassName,
                )}
                data-testid="Input"
                disabled={disabled}
                id={id}
                inputMode={inputMode}
                max={max}
                min={min}
                name={name}
                placeholder={placeholder}
                ref={input => {
                  this.input = input
                }}
                required={isRequired}
                spellCheck="false"
                type={type || "text"}
                value={value}
                onBlur={() =>
                  this.setState(
                    { isRequirementErrorShown: isRequired && !value },
                    onBlur,
                  )
                }
                onChange={e => {
                  onChange(e.target.value)
                  this.setState({ isRequirementErrorShown: false })
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && onSubmit) {
                    onSubmit(value)
                  }
                }}
              />
              {right ? (
                <FrameProvider className="Input--label Input--right-label">
                  {right}
                </FrameProvider>
              ) : undefined}
            </div>
            {status === "wait" ? (
              <div className="Input--info Input--wait">
                <Loader size="xsmall" />
              </div>
            ) : status === "valid" && valueInfo ? (
              <div className="Input--info">
                <Icon className="Input--info-icon" value="check" />
                <div className="Input--info-text">{valueInfo}</div>
              </div>
            ) : status === "invalid" && errorInfo ? (
              <div className="Input--info">
                <Icon className="Input--info-icon" value="close" />
                <div className="Input--info-text">{errorInfo}</div>
              </div>
            ) : isRequirementErrorShown ? (
              <div className="Input--info">
                <Icon className="Input--info-icon" value="close" />
                <div className="Input--info-text">This field is required.</div>
              </div>
            ) : null}
          </DivContainer>
        )}
      </FrameConsumer>
    )
  }
}

export default Input

const DivContainer = styled.div`
  &.Input--framed {
    margin-top: -1px;
    margin-bottom: -1px;
    border-radius: inherit;

    &:first-child {
      .Input--main {
        border-top: 0;
        border-radius: inherit;
      }
    }

    &:last-child {
      .Input--main {
        border-bottom: 0;
        border-radius: inherit;
      }
    }

    .Input--main {
      border-left: 0;
      border-right: 0;
      border-radius: 0;

      .Input--left-label {
        border-radius: 0;
      }
    }
  }

  &.Input--disabled {
    .Input--main {
      background-color: ${props => props.theme.colors.withOpacity.fog.light};
      color: ${props => props.theme.colors.text.subtle};
    }
  }

  &.Input--invalid {
    .Input--main {
      color: ${props => props.theme.colors.error};
      border-color: ${props => props.theme.colors.error};
      z-index: 1;
    }

    .Input--info {
      color: ${props => props.theme.colors.error};

      .Input--info-icon {
        font-size: 18px;
      }
    }
  }

  &.Input--valid {
    .Input--info-icon {
      color: ${props => props.theme.colors.success};
      font-size: 18px;
    }
  }

  .Input--main {
    background-color: ${props => props.theme.colors.input};
    border-radius: ${props => props.theme.borderRadius.default};
    border: solid 1px ${props => props.theme.colors.border};
    display: flex;
    /* NOTE: should not prevent overflows
       because Inputs can contain dropdowns
       overflow: hidden;
     */
    position: relative;

    &:hover {
      ${props =>
        themeVariant({
          variants: { dark: { backgroundColor: props.theme.colors.ash } },
        })}
    }

    &:focus-within {
      color: inherit;
      box-shadow: ${props => props.theme.shadow};
      z-index: 1;

      ${props =>
        themeVariant({
          variants: { dark: { backgroundColor: props.theme.colors.ash } },
        })}
    }

    .Input--label {
      align-items: center;
      color: ${props => props.theme.colors.text.subtle};
      display: flex;
      justify-content: center;
      user-select: none;

      ${props =>
        themeVariant({
          variants: {
            light: {
              backgroundColor: props.theme.colors.surface,
            },
            dark: {
              backgroundColor: props.theme.colors.ash,
              color: props.theme.colors.text.body,
            },
          },
        })}
    }

    .Input--prefix {
      align-items: center;
      background-color: transparent;
      color: ${props => props.theme.colors.text.subtle};
      display: flex;
      padding-left: 12px;
    }

    .Input--input {
      background-color: transparent;
      border: none;
      flex: 1 0;
      height: 48px;
      outline: none;
      padding: 0 12px 0 0;
      min-width: 0;
    }

    .Input--left-label {
      border-bottom-left-radius: 5px;
      border-right: solid 1px ${props => props.theme.colors.border};
      border-top-left-radius: 5px;
    }

    .Input--right-label {
      border-bottom-right-radius: 5px;
      border-left: solid 1px ${props => props.theme.colors.border};
      border-top-right-radius: 5px;
    }
  }

  .Input--info {
    align-items: center;
    display: flex;
    padding: 4px 4px 6px 4px;

    &.Input--wait {
      padding-top: 6px;
    }

    .Input--info-text {
      font-size: 12px;
      margin-left: 2px;
    }
  }

  input[type="time"]::-webkit-calendar-picker-indicator,
  input[type="date"]::-webkit-calendar-picker-indicator {
    ${themeVariant({
      variants: {
        dark: {
          filter: "invert(1)",
          outline: "none",
        },
      },
    })}
  }
`
