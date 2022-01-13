import { FC } from 'react'
import { Button } from '@revolut/ui-kit'

import { VirtualCardTypeSelectionActionProps } from './types'

export const VirtualCardTypeSelectionAction: FC<VirtualCardTypeSelectionActionProps> = ({
  selectedCardTypeOptions,
  isLoading,
  onSubmit,
}) => (
  <Button
    variant={selectedCardTypeOptions.submitButtonVariant}
    elevated
    disabled={isLoading}
    pending={isLoading}
    onClick={onSubmit}
  >
    {selectedCardTypeOptions.submitButtonText}
  </Button>
)
