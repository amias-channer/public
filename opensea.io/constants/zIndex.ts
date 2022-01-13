let current = 0

const get = () => {
  current += 10
  return current
}

export const Z_INDEX = {
  PROFILE_IMAGE: get(),
  BADGE: get(),
  OVERLAY: get(),
  DRAWER: get(),
  NAVBAR: get(),
  ANNOUNCEMENT_BANNER: get(),
  SEARCH_FILTER: get(),
  DRAWER_MOBILE: get(),
  MODAL: get(),
  TOASTS: get(),
}
