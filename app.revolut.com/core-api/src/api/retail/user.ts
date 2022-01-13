import axios from 'axios'

import { UserCompanyDto, UserFeatureDto, UserPortfolioDto } from '@revolut/rwa-core-types'

export const getUserCompany = () =>
  axios.get<UserCompanyDto>('/retail/user/current/company')

export const getUserFeatures = () =>
  axios.get<ReadonlyArray<UserFeatureDto>>('/retail/user/current/features')

export const getUserPortfolio = () =>
  axios.get<UserPortfolioDto>('/retail/user/current/portfolio')
