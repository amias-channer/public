import { FC } from 'react'
import { ShevronLeft } from '@revolut/icons'
import { Button } from '@revolut/ui-kit'

type BackButtonProps = {
  onClick?: VoidFunction
}

export const BackButton: FC<BackButtonProps> = (props) => (
  <Button
    data-cy="back-button"
    aria-label="Previous"
    variant="navigation"
    useIcon={ShevronLeft}
    {...props}
  />
)
