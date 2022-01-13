import axios from 'axios'

import { AccountDto } from '@revolut/rwa-core-types'

export const getAccounts = () => axios.get<AccountDto[]>('retail/topup/accounts')
