import React from "react"
import { useRouter } from "next/router"
import Link from "./Link.react"

interface Props {
  href: string
  children?: React.ReactNode
  exact?: boolean
  className?: string
  activeClassName?: string
}

const ActiveLink = ({
  children,
  href,
  exact,
  activeClassName,
  className,
}: Props) => {
  const router = useRouter()
  const isActive =
    router &&
    (exact
      ? router.asPath === href
      : router.asPath && href && router.asPath.startsWith(href))

  // NOTE: causes unclickability in mobile browsers
  // const onMouseUp = () => {
  //   // Fix bug with NextJS link not firing hashchange
  //   let hash
  //   const existingHash = window.location.hash

  //   if (href.indexOf("#") != -1) {
  //     hash = href.substr(href.indexOf("#") + 1)
  //   } else if (!!existingHash) {
  //     hash = undefined
  //   }
  //   $(window).trigger('OS_hashchange', hash)
  // }

  return (
    <Link
      className={`${className || ""} ${isActive ? activeClassName : ""}`}
      href={href}
    >
      {children}
    </Link>
  )
}

export default ActiveLink
