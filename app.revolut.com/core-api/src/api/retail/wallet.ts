import axios from 'axios'

import { WalletDto } from '@revolut/rwa-core-types'

export const getWallet = () => axios.get<WalletDto>('retail/user/current/wallet')
