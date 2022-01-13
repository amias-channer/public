import { FC } from 'react'
import { Box, ColorSelector, Flex, RadioGroup } from '@revolut/ui-kit'

import { PhysicalCardTypeOptions } from '../types'

type PhysicalCardsColorPickerProps = {
  selectedIndex: number
  selectedGroup: PhysicalCardTypeOptions[]
  onIndexChange: (index: number | null) => void
}

export const PhysicalCardsColorPicker: FC<PhysicalCardsColorPickerProps> = ({
  selectedIndex,
  selectedGroup,
  onIndexChange,
}) => {
  const colorPalette = selectedGroup.map((options) => options.colorSrc)

  return (
    <RadioGroup value={selectedIndex} onChange={onIndexChange}>
      {(group) => (
        <Flex justifyContent="center">
          {colorPalette.map((color, index) => {
            const cardCode = selectedGroup[index].code

            return (
              <Box key={cardCode} mr={colorPalette.length - 1 !== index ? '14px' : '0'}>
                <ColorSelector
                  aria-label={cardCode}
                  image={color}
                  {...group.getInputProps({ value: index })}
                />
              </Box>
            )
          })}
        </Flex>
      )}
    </RadioGroup>
  )
}
