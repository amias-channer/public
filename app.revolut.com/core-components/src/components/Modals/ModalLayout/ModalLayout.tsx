import { FC, ReactElement } from 'react'
import { TextButton, TextBox as UiKitTextBox, TextButtonProps } from '@revolut/ui-kit'

import { PrimaryButton, PrimaryButtonProps } from '../../Buttons'
import { H2 } from '../../H2'
import { Spacer } from '../../Spacer'
import { TextBox } from '../../TextBox'
import { BaseModal, BaseModalProps } from '../BaseModal'

type ModalLayoutProps = {
  Icon: ReactElement
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonProps?: PrimaryButtonProps
  secondaryButtonText?: string
  secondaryButtonProps?: TextButtonProps
} & BaseModalProps

export const ModalLayout: FC<ModalLayoutProps> = ({
  Icon,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonProps,
  secondaryButtonProps,
  isOpen,
  onRequestClose,
}) => (
  <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
    {Icon}
    <Spacer h={{ _: 'px24', md: 'px32' }} />
    {title && <H2>{title}</H2>}

    {title && <Spacer h="px8" />}

    {description && <TextBox>{description}</TextBox>}

    <Spacer h={{ _: 'px24', md: 'px32' }} />

    {primaryButtonText && (
      <PrimaryButton hasElevation={false} {...primaryButtonProps}>
        {primaryButtonText}
      </PrimaryButton>
    )}

    {secondaryButtonText && <Spacer h={{ _: 'px20', md: 'px28' }} />}

    {secondaryButtonText && (
      <UiKitTextBox textAlign="center">
        <TextButton {...secondaryButtonProps}>{secondaryButtonText}</TextButton>
      </UiKitTextBox>
    )}
  </BaseModal>
)
