import axios from 'axios'

import { User } from '@revolut/rwa-core-types'

/**
 * Should not be used outside the "core-auth" module.
 */
export const getUser = () => axios.get<{ user: User }>('/retail/user/current')
