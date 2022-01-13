import { useContext, useEffect } from 'react'

import { CookiesBannerContext } from 'components/CookiesBanner/CookiesBannerProvider'

export const useShowCookiesBannerOnMount = () => {
  const { setIsHidden: setIsCookiesBannerHidden } = useContext(CookiesBannerContext)

  useEffect(() => {
    const openCookieBanner = () => {
      setIsCookiesBannerHidden(false)
    }

    openCookieBanner()
  }, [setIsCookiesBannerHidden])
}
