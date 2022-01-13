import { FC, useCallback } from 'react'
import { ElevationLevel, Modal, TransitionSlide } from '@revolut/ui-kit'

import { Z_INDICES } from '@revolut/rwa-core-styles'
import { KeyboardKey, useEventListener } from '@revolut/rwa-core-utils'

import { BaseModalTestId } from './constants'
import { BoxStyled } from './styled'

const DEFAULT_TRANSITION_DURATION = 450
const DEFAULT_TRANSITION_OFFSET = -100

export type BaseModalProps = {
  isOpen?: boolean
  transition?: {
    duration: number
    offsetY: number
  }
  onRequestClose: VoidFunction
  title?: string
}

export const BaseModal: FC<BaseModalProps> = ({
  isOpen,
  transition = {
    duration: DEFAULT_TRANSITION_DURATION,
    offsetY: DEFAULT_TRANSITION_OFFSET,
  },
  onRequestClose,
  children,
}) => {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KeyboardKey.Esc) {
        onRequestClose()
      }
    },
    [onRequestClose],
  )

  useEventListener('keydown', onKeyDown)

  return (
    <Modal
      data-testid={BaseModalTestId.Overlay}
      isOpen={isOpen}
      zIndex={Z_INDICES.baseModal}
      onRequestClose={onRequestClose}
    >
      <TransitionSlide
        in={isOpen}
        offsetY={transition.offsetY}
        duration={transition.duration}
        data="modal-transition-slide"
      >
        <BoxStyled
          bg="modalBg"
          radius="popup"
          elevation={ElevationLevel.LEVEL}
          px={{ _: 'px24', tablet: 'px40' }}
          py={{ _: 'px32', tablet: 'px48' }}
          my={{ _: 'px128', tablet: 'px114' }}
          mx={{ _: 'auto', tablet: 'px260' }}
        >
          {children}
        </BoxStyled>
      </TransitionSlide>
    </Modal>
  )
}
