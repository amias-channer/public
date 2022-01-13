import React from "react"
import styled from "styled-components"
import { selectClassNames } from "../../lib/helpers/styling"

interface Props {
  className?: string
}

const YCombinatorLogo = ({ className }: Props) => (
  <svg
    className={selectClassNames(
      "YCombinatorLogo",
      { default: !className },
      className,
    )}
    viewBox="0 0 140 30"
  >
    <path className="YCombinatorLogo--square" d="M28.9,0.9H0v28.9h28.9V0.9z" />
    <path
      className="YCombinatorLogo--y"
      d="M13.5,17.3L8.5,8h2.3l2.9,5.9c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.1,0.2,0.2,0.4l0.1,0.1v0.1
	c0.1,0.2,0.1,0.3,0.2,0.5c0.1,0.1,0.1,0.3,0.2,0.4c0.1-0.3,0.3-0.5,0.4-0.9c0.1-0.3,0.3-0.6,0.5-0.9L18.3,8h2.1l-5,9.4v6h-1.9V17.3z
	"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M42.1,6.5c1.4,0,2.7,0.4,3.7,1.2l-1,1.2c-0.9-0.6-1.7-1-2.8-1c-1.6,0-2.9,0.9-3.6,2.5c-0.4,1-0.6,2.2-0.6,3.9
	c0,1.3,0.2,2.3,0.5,3.1c0.8,1.8,2,2.7,4,2.7c1.1,0,2-0.3,2.9-1l1,1.3c-1.3,0.8-2.6,1.2-4,1.2c-1.7,0-3.2-0.7-4.3-2.1
	c-1.2-1.3-1.6-3.2-1.6-5.4c0-2.2,0.6-4,1.7-5.4C38.9,7.3,40.4,6.5,42.1,6.5z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M47.6,16.1c0-1.7,0.4-3.1,1.3-4c0.9-1,1.9-1.5,3.3-1.5c1.5,0,2.8,0.6,3.7,1.8c0.7,1,1,2.3,1,4
	c0,1.9-0.6,3.5-1.6,4.4c-0.8,0.7-1.7,1.1-2.9,1.1c-1.4,0-2.5-0.5-3.4-1.5C48,19.2,47.6,17.8,47.6,16.1z M54.4,13.3
	c-0.5-0.9-1.2-1.3-2.2-1.3c-1.1,0-1.7,0.4-2.2,1.2c-0.4,0.6-0.5,1.5-0.5,2.8c0,1.6,0.2,2.8,0.7,3.5c0.5,0.7,1.2,1.1,2.1,1.1
	c1.2,0,1.9-0.6,2.3-1.6c0.2-0.6,0.3-1.3,0.3-2.3C54.9,15,54.8,13.9,54.4,13.3z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M59.9,13.5c0-1.1-0.1-1.9-0.4-2.6l1.6-0.4c0.3,0.5,0.4,1.1,0.4,1.5v0.1c0.4-0.4,0.8-0.8,1.3-1.1
	c0.7-0.4,1.3-0.6,1.8-0.6c0.9,0,1.6,0.4,2.1,1.1c0.1,0.2,0.3,0.5,0.4,0.7c1.2-1.2,2.2-1.7,3.4-1.7c0.8,0,1.4,0.3,1.9,0.8
	c0.5,0.6,0.8,1.3,0.8,2v8h-1.7v-7.9c0-1.1-0.5-1.5-1.3-1.5c-0.5,0-1.1,0.2-1.5,0.6c-0.2,0.2-0.6,0.5-1.1,0.9l-0.2,0.2v7.8h-1.8v-7.5
	c0-0.7-0.1-1.2-0.3-1.3C65,12.1,64.7,12,64.2,12c-0.8,0-1.6,0.5-2.7,1.4v7.9h-1.6V13.5L59.9,13.5z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M76.2,6.1L78,5.7c0.2,0.8,0.3,1.6,0.3,2.7v2.4c0,0.6,0,1,0,1.2c1-1,2-1.4,3.1-1.4c1.3,0,2.3,0.5,3,1.4
	c0.8,1,1.2,2.3,1.2,4c0,1.7-0.4,3.1-1.2,4.1c-0.8,1.1-1.8,1.5-3.1,1.5c-0.6,0-1.1-0.1-1.6-0.4c-0.6-0.3-1-0.6-1.3-1
	c-0.1,0.5-0.2,0.9-0.3,1.2h-1.6c0.2-0.5,0.3-1.3,0.3-2.7V8.6C76.6,7.5,76.5,6.6,76.2,6.1z M79,12.7c-0.3,0.2-0.6,0.5-0.8,0.8V19
	c0.7,0.9,1.5,1.3,2.6,1.3c0.9,0,1.5-0.3,1.9-1c0.5-0.8,0.8-1.8,0.8-3.4c0-1.3-0.2-2.3-0.7-2.9c-0.4-0.6-1.1-0.9-2-0.9
	C80.3,12,79.6,12.2,79,12.7z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M88,7.5c0-0.4,0.1-0.7,0.4-1c0.3-0.3,0.6-0.4,1-0.4s0.7,0.1,1,0.4c0.3,0.3,0.4,0.6,0.4,1c0,0.4-0.1,0.7-0.4,1
	c-0.3,0.3-0.6,0.4-1,0.4s-0.7-0.1-1-0.4S88,7.9,88,7.5z M88.4,21.4V10.8l1.7-0.3v10.9H88.4z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M93.9,13.5c0-0.8,0-1.3-0.1-1.4c0-0.3-0.2-0.6-0.4-1.1l1.6-0.5c0.3,0.6,0.4,1.1,0.4,1.6
	c1.1-1.1,2.2-1.6,3.4-1.6c0.6,0,1.1,0.1,1.5,0.4c0.5,0.3,0.9,0.7,1.1,1.2c0.2,0.4,0.3,0.8,0.3,1.3v8.1h-1.6v-7.2
	c0-0.9-0.1-1.4-0.4-1.7s-0.7-0.5-1.2-0.5c-0.4,0-1,0.2-1.5,0.5c-0.6,0.3-1.1,0.7-1.4,1.1v7.9h-1.6V13.5L93.9,13.5z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M105.6,13.1l-0.9-1.2c1.4-1,2.9-1.4,4.4-1.4c1.5,0,2.5,0.6,3,1.6c0.2,0.4,0.2,1,0.2,1.8v0.6l-0.1,3.5
	c0,0.1,0,0.3,0,0.5c0,0.6,0,1,0.1,1.3c0.1,0.4,0.4,0.7,0.8,0.9l-0.9,1.2c-0.8-0.3-1.3-0.8-1.4-1.5c-1,1-2,1.4-3.1,1.4
	c-1.1,0-1.9-0.3-2.6-0.9c-0.6-0.5-0.9-1.3-0.9-2.2c0-1.3,0.5-2.1,1.4-2.8c1-0.7,2.4-1,4.1-1c0.3,0,0.5,0,0.8,0V14
	c0-0.9-0.1-1.4-0.4-1.6c-0.4-0.4-0.8-0.6-1.4-0.6c-0.6,0-1.3,0.2-2,0.5C106.4,12.5,106,12.8,105.6,13.1z M110.7,18.8l0.1-2.8
	c-0.5,0-0.8,0-0.9,0c-1.5,0-2.5,0.3-3.1,0.9c-0.4,0.4-0.6,1-0.6,1.7c0,1.3,0.6,1.9,1.8,1.9C109.2,20.4,110.1,19.8,110.7,18.8z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M117.8,10.8h2.7l-0.5,1.3h-2.2V19c0,0.6,0.1,1,0.3,1.3c0.2,0.2,0.6,0.4,1.1,0.4c0.4,0,0.8-0.1,1.1-0.2l0.2,1.1
	c-0.6,0.3-1.2,0.4-1.8,0.4c-1.6,0-2.4-0.8-2.4-2.4v-7.3h-1.4v-1.3h1.3v-0.2c0-0.2,0.1-1,0.2-2.2V8.1l1.7-0.4
	C117.8,8.8,117.8,9.9,117.8,10.8z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M122.2,16.1c0-1.7,0.4-3.1,1.3-4c0.8-1,1.9-1.5,3.3-1.5c1.5,0,2.8,0.6,3.7,1.8c0.7,1,1,2.3,1,4
	c0,1.9-0.6,3.5-1.6,4.4c-0.8,0.7-1.7,1.1-2.9,1.1c-1.4,0-2.5-0.5-3.4-1.5C122.7,19.2,122.2,17.8,122.2,16.1z M129.1,13.3
	c-0.5-0.9-1.2-1.3-2.2-1.3c-1.1,0-1.7,0.4-2.2,1.2c-0.4,0.6-0.5,1.5-0.5,2.8c0,1.6,0.2,2.8,0.7,3.5c0.5,0.7,1.2,1.1,2.1,1.1
	c1.2,0,1.9-0.6,2.3-1.6c0.2-0.6,0.3-1.3,0.3-2.3C129.6,15,129.4,13.9,129.1,13.3z"
    />
    <path
      className="YCombinatorLogo--letters"
      d="M134.6,13.3c0-1-0.1-1.7-0.4-2.3l1.6-0.5c0.3,0.6,0.4,1.1,0.4,1.6v0.2c0.9-1.2,1.8-1.7,3-1.7
	c0.2,0,0.4,0,0.6,0.1l-0.7,1.8c-0.2-0.1-0.4-0.1-0.5-0.1c-0.4,0-0.9,0.1-1.3,0.4c-0.4,0.3-0.8,0.6-1,1c-0.1,0.3-0.2,0.7-0.2,1.2v6.7
	h-1.6V13.3z"
    />
  </svg>
)

export default styled(YCombinatorLogo)`
  .YCombinatorLogo--default {
    .YCombinatorLogo--y {
      fill: ${props => props.theme.colors.surface};
    }
    .YCombinatorLogo--y {
      fill: ${props => props.theme.colors.surface};
    }
    .YCombinatorLogo--square {
      fill: ${props => props.theme.colors.gray};
    }
  }
`
