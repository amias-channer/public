import { FC } from 'react'
import { Flex, Group, Text, TextButton } from '@revolut/ui-kit'

import { AllOrNothing } from '@revolut/rwa-core-types'

type MethodsGroupProps = {
  groupTitle?: string
  isFirst?: boolean
} & AllOrNothing<{
  actionButtonText: string
  actionButtonOnClick: VoidFunction
}>

export const MethodsGroup: FC<MethodsGroupProps> = ({
  groupTitle,
  actionButtonText,
  actionButtonOnClick,
  isFirst,
  children,
}) => {
  return (
    <>
      <Flex mt={isFirst ? '8px' : '32px'} mb="16px">
        <Text flex="1" color="grey-tone-50" variant="h6" use="h6">
          {groupTitle}
        </Text>
        {actionButtonText && (
          <TextButton textStyle="h6" onClick={actionButtonOnClick}>
            {actionButtonText}
          </TextButton>
        )}
      </Flex>

      <Group>{children}</Group>
    </>
  )
}
