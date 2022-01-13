import * as React from 'react'

import { Link } from '../components'

import { HELP_CENTRE_URL } from './links'

export const HELP_CENTRE_LINK = (
  <Link
    variant='secondary'
    href={HELP_CENTRE_URL}
    target='_blank'
    rel='noreferrer noopener'
  >
    Help centre
  </Link>
)
