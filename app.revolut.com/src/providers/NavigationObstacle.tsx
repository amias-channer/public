import React, { createContext, Dispatch, FC, SetStateAction, useState } from 'react'

export type Obstacle = (callback: () => void) => void

type NavigationObstacleState = {
  navigationObstacle: Obstacle | undefined
  setNavigationObstacle: Dispatch<SetStateAction<Obstacle | undefined>>
}

export const NavigationObstacleContext = createContext<NavigationObstacleState>({
  navigationObstacle: undefined,
  setNavigationObstacle: () => {},
})

export const NavigationObstacleProvider: FC = ({ children }) => {
  const [navigationObstacle, setNavigationObstacle] = useState<Obstacle>()

  return (
    <NavigationObstacleContext.Provider
      value={{ navigationObstacle, setNavigationObstacle }}
    >
      {children}
    </NavigationObstacleContext.Provider>
  )
}
