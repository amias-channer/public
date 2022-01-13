import React, { FC, createContext, useContext } from 'react'

import { StatusBannerType } from '../api/types'

export const StatusBannersContext = createContext<StatusBannerType[]>([])

export const StatusBannersProvider: FC<{
  statusBanners: StatusBannerType[]
}> = ({ statusBanners, children }) => (
  <StatusBannersContext.Provider value={statusBanners}>
    {children}
  </StatusBannersContext.Provider>
)

export const useStatusBanners = () => useContext(StatusBannersContext)
