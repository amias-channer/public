import axios from 'axios'

import { UserTopupCardDto } from '@revolut/rwa-core-types'

export const getUserTopupCards = () =>
  axios.get<ReadonlyArray<UserTopupCardDto>>('/retail/user/current/cards')
