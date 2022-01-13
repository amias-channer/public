import { createContext, useContext } from 'react'

import api, { Api } from '../api/api'

export const ApiContext = createContext<Api>(api)

export const useApi = () => useContext(ApiContext)
