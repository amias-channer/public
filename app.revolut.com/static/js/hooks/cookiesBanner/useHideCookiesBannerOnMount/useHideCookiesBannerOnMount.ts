import { useContext, useEffect } from 'react'

import { CookiesBannerContext } from 'components/CookiesBanner/CookiesBannerProvider'

export const useHideCookiesBannerOnMount = () => {
  const { setIsHidden: setIsCookiesBannerHidden } = useContext(CookiesBannerContext)

  useEffect(() => {
    const hideCookieBanner = () => {
      setIsCookiesBannerHidden(true)
    }

    hideCookieBanner()
  }, [setIsCookiesBannerHidden])
}
