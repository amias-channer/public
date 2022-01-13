import MockAdapter from 'axios-mock-adapter'

import { ChatAxios } from '../services/axios/axios-config'

export const createMock = () => new MockAdapter(ChatAxios)
