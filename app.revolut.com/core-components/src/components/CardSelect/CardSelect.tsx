import { FC } from 'react'
import { Box, Card, Media, TextBox } from '@revolut/ui-kit'

import { CardSelectProps } from './types'

export const CardSelect: FC<CardSelectProps> = ({ options, onChange }) => (
  <Box>
    {options.map(({ label, description, value, icon }, index) => {
      const isLastItem = index === options.length - 1

      return (
        <Card
          key={value}
          p="11px"
          mb={isLastItem ? 0 : '16px'}
          variant="outline"
          role="button"
          onClick={() => onChange(value)}
        >
          <Media p="8px">
            <Media.Side px="8px">{icon}</Media.Side>
            <Media>
              <Media.Content alignSelf="center" px="16px">
                <TextBox fontWeight="bolder">{label}</TextBox>
                {description && (
                  <TextBox mt="4px" color="hint">
                    {description}
                  </TextBox>
                )}
              </Media.Content>
            </Media>
          </Media>
        </Card>
      )
    })}
  </Box>
)
