import { FC } from 'react'

import { StatusIconType } from '../../Icons'
import { AuthLayout, AuthLayoutProps } from '../AuthLayout'
import { StatusLayoutTitle } from './Title'

type StatusLayoutProps = {
  iconType: StatusIconType
  iconColor?: string
  title: string
  authLayoutProps?: Pick<
    AuthLayoutProps,
    | 'description'
    | 'illustration'
    | 'submitButtonText'
    | 'submitButtonEnabled'
    | 'secondaryButtonText'
    | 'handleBackButtonClick'
    | 'handleCloseButtonClick'
    | 'handleSubmitButtonClick'
    | 'handleSecondaryButtonClick'
  >
}

export const StatusLayout: FC<StatusLayoutProps> = ({
  iconType,
  iconColor,
  title,
  authLayoutProps,
}) => (
  <AuthLayout
    title={<StatusLayoutTitle iconType={iconType} iconColor={iconColor} title={title} />}
    submitButtonEnabled
    secondaryButtonEnabled
    {...authLayoutProps}
  />
)
