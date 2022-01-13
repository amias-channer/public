import axios from 'axios'

import { Url } from '@revolut/rwa-core-utils'

export const signOut = () => axios.post(Url.SignOut)
