import * as Icons from '@revolut/icons'

import { ExclamationMarkOutlinedIcon } from '../ExclamationMarkOutlinedIcon'
import { InfoIcon } from '../InfoIcon'
import { PendingIcon } from '../PendingIcon'

export enum StatusIconType {
  Info = 'Info',
  Success = 'Success',
  Error = 'Error',
  Pending = 'Pending',
  Warning = 'Warning',
}

export const ICONS = {
  [StatusIconType.Info]: InfoIcon,
  [StatusIconType.Success]: Icons.Check,
  [StatusIconType.Error]: Icons.Cross,
  [StatusIconType.Pending]: PendingIcon,
  [StatusIconType.Warning]: ExclamationMarkOutlinedIcon,
}

export const ICON_TYPE_COLORS = {
  [StatusIconType.Error]: 'iconError',
  [StatusIconType.Warning]: 'warning',
}

export const DEFAULT_COLOR = 'primary'
