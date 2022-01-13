import React from "react"
import Block from "../../design-system/Block"
import Button, { ButtonProps } from "../../design-system/Button"
import SpaceBetween from "../../design-system/SpaceBetween"
import Text from "../../design-system/Text"

type Props = Omit<ButtonProps, "children"> & {
  count: number
}

export const FilterButton = ({ count, ...rest }: Props) => {
  return (
    <Button height="50px" icon="filter_list" variant="tertiary" {...rest}>
      <SpaceBetween>
        <span>Filter</span>
        {count > 0 && (
          <Block marginLeft="18px">
            <Text as="span" variant="small">
              {count}
            </Text>
          </Block>
        )}
      </SpaceBetween>
    </Button>
  )
}

export default FilterButton
