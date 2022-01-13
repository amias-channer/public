import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { v4 as uuid } from 'uuid'

import { BannerType } from '../redux/reducers/banners'
import { SUPPORT_TIME, getSupportArrivalTime } from '../helpers/time'

import { HELP_CENTRE_LINK } from './customText'

export const BannerVariant = {
  INFO: 'info',
  WARNING: 'warning',
  DEFAULT: 'default',
}

export const UPLOAD_BANNER_ID = uuid()
export const SOMETHING_WENT_WRONG_ID = uuid()
export const UNAVAILABLE_ID = uuid()
export const SUPPORT_OFFLINE_ID = uuid()
export const COMMON_ID = uuid()
export const TICKET_BANNER_ID = uuid()

export const WRONG_TYPE_FILE_BANNER: BannerType = {
  id: UPLOAD_BANNER_ID,
  title: (
    <FormattedMessage
      id='supportChat.banners.wrongFileTypeTitle'
      defaultMessage='Please choose an image or a PDF file'
    />
  ),
  variant: BannerVariant.WARNING,
}

export const WRONG_SIZE_FILE_BANNER: BannerType = {
  id: UPLOAD_BANNER_ID,
  title: (
    <FormattedMessage
      id='supportChat.banners.wrongFileSizeTitle'
      defaultMessage='File size should not exceed 10Mb'
    />
  ),
  variant: BannerVariant.WARNING,
}

export const SOMETHING_WENT_WRONG_BANNER: BannerType = {
  id: SOMETHING_WENT_WRONG_ID,
  title: (
    <FormattedMessage
      id='supportChat.banners.somethingWentWrongTitle'
      defaultMessage='Something went wrong'
    />
  ),
  variant: BannerVariant.WARNING,
}

export const IS_OFFLINE_BANNER: BannerType = {
  id: SOMETHING_WENT_WRONG_ID,
  title: (
    <FormattedMessage
      id='supportChat.banners.userIsOfflineTitle'
      defaultMessage='Looks like you are offline'
    />
  ),
  variant: BannerVariant.WARNING,
}

export const SERVICE_UNAVAILABLE_BANNER: BannerType = {
  id: UNAVAILABLE_ID,
  title: (
    <FormattedMessage
      id='supportChat.banners.serviceUnavailableTitle'
      defaultMessage='Sorry, service is temporarily unavailable'
    />
  ),
  important: true,
  variant: BannerVariant.WARNING,
}

export const SUPPORT_OFFLINE_BANNER = (
  weekHours: typeof SUPPORT_TIME
): BannerType => ({
  id: SUPPORT_OFFLINE_ID,
  title: (
    <FormattedMessage
      id='supportChat.banners.supportOfflineTitle'
      defaultMessage='Support is offline'
    />
  ),
  text: (
    <FormattedMessage
      id='supportChat.banners.supportOfflineText'
      defaultMessage="We'll be back online in approximately {weekHours}. Check our {helpCentreLink} in the meantime."
      values={{
        weekHours: getSupportArrivalTime(weekHours),
        helpCentreLink: HELP_CENTRE_LINK,
      }}
    />
  ),
  variant: BannerVariant.DEFAULT,
  availablePath: /\/chat\/.*/,
})

export const COMMON_BANNER: BannerType = {
  id: COMMON_ID,
  availablePath: /\/chat\/new/,
}

export const TICKET_BANNER: BannerType = {
  id: TICKET_BANNER_ID,
  availablePath: /\/chat\/.+/,
  forbiddenPath: /\/chat\/new/,
}
