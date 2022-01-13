import { FC, useEffect } from 'react'
import * as ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'

type GoogleAnalyticsProps = {
  id: string
}

export const GoogleAnalytics: FC<GoogleAnalyticsProps> = ({ id }) => {
  const history = useHistory()

  useEffect(() => {
    ReactGA.initialize(id)

    history.listen((location) => {
      const newLocation = location.pathname + location.search
      ReactGA.set({ page: newLocation })
      ReactGA.pageview(newLocation)
    })
  }, [history, id])

  return null
}
