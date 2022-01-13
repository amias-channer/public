import { VFC } from 'react'
import { RouteProps } from 'react-router-dom'

import { AuthRoute } from './AuthRoute'

export const FullAccessAuthRoute: VFC<RouteProps> = (props) => {
  return <AuthRoute {...props} isFullAccessRequired />
}
