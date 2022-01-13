import React from "react"
import styled from "styled-components"
import { variant } from "styled-system"
import { appendClassName, selectClassNames } from "../../lib/helpers/styling"
import Icon from "../common/Icon.react"
import Image, { ImageProps } from "../common/Image.react"

type Variant = "round" | "square"

type Props = {
  className?: string
  disabled?: boolean
  onChange: (values: { url: string; value: File }) => void
  url?: string
  variant?: Variant
  imageProps?: ImageProps
} & Pick<JSX.IntrinsicElements["input"], "name" | "id">

const ImageInput = ({
  className,
  onChange,
  url,
  name,
  id,
  disabled,
  variant = "square",
  imageProps = {},
}: Props) => (
  <DivContainer
    className={selectClassNames(
      "ImageInput",
      { "with-image": !!url, disabled },
      className,
    )}
    variant={variant}
  >
    <Image
      variant={variant}
      {...imageProps}
      className={appendClassName("ImageInput--image", imageProps.className)}
      url={url}
    >
      <div className="ImageInput--wrapper">
        <input
          accept="image/*"
          className="ImageInput--input"
          id={id}
          name={name}
          type="file"
          onChange={event => {
            const files = event.target?.files
            const value = files && files[0]
            if (!value) {
              return
            }
            onChange({ url: URL.createObjectURL(value), value })
          }}
        />
        <Icon className="ImageInput--icon" value="image" />
      </div>
    </Image>
  </DivContainer>
)
export default ImageInput

const DivContainer = styled.div<{ variant: Variant }>`
  border: 3px dashed #cccccc;
  cursor: pointer;
  height: 160px;
  margin-bottom: 20px;
  margin-top: 6px;
  padding: 4px;
  width: 160px;

  &.ImageInput--disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  ${props =>
    variant({
      variants: {
        round: {
          borderRadius: props.theme.borderRadius.circle,
        },
        square: {
          borderRadius: props.theme.borderRadius.default,
        },
      },
    })}

  &:hover {
    border-color: #aaaaaa;

    .ImageInput--icon {
      color: #aaaaaa;
    }
  }

  &.ImageInput--with-image {
    &:hover {
      .ImageInput--icon {
        display: block;
        opacity: 0.5;
      }
    }

    .ImageInput--icon {
      display: none;
    }
  }

  .ImageInput--image {
    height: 100%;

    .ImageInput--wrapper {
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: center;
      position: relative;

      .ImageInput--input {
        cursor: pointer;
        height: 100%;
        opacity: 0;
        position: absolute;
        width: 100%;
      }
    }
  }

  .ImageInput--icon {
    color: #cccccc;
    font-size: 84px;
    pointer-events: none;
  }
`
