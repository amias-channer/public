import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { DEFAULT_TITLE, DEFAULT_DESC, DEFAULT_IMG } from "../../constants"
import API from "../../lib/api"

interface Props {
  title?: string
  description?: string
  image?: string
  url?: string
}

const OpenSeaHead = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  image = DEFAULT_IMG,
  url,
}: Props) => {
  const router = useRouter()
  const simplePath =
    router && router.asPath ? router.asPath.split(/[?#]/)[0] : ""

  const canonicalUrl = url || `${API.getWebUrl()}${simplePath}`

  return (
    <Head>
      {/* Needed here without a `key` otherwise Next.js injects a bad one */}
      <meta content="width=device-width,initial-scale=1" name="viewport" />

      <meta content="summary_large_image" property="twitter:card" />

      {/* Open Graph tags, for social media */}
      <title key="title">{title}</title>
      <meta content={title} key="og:title" property="og:title" />
      <meta
        content={description}
        key="og:description"
        property="og:description"
      />
      <meta content={image} key="og:image" property="og:image" />

      {/* For canonical link hrefs in SEO */}
      <link href={canonicalUrl} key="canonical" rel="canonical" />
      {/* TODO test: <meta key="og:url" property="og:url" content={url} /> */}

      {/* Pinterest site verificatin */}
      <meta content="290482bea3c8c8f9a5b64006fcdd0fdc" name="p:domain_verify" />

      {/* TODO author link like YouTube channel */}
      <meta content="OpenSea" key="author" name="author" />

      <meta content="website" key="og:type" property="og:type" />
      <meta content="OpenSea" key="og:site_name" property="og:site_name" />

      {/* For Google. Have to separate because Discord gets confused */}
      <meta content={description} key="description" name="description" />

      <meta
        content="hMdfCgnav7IgocRK"
        key="fortmatic-site-verification"
        name="fortmatic-site-verification"
      />
    </Head>
  )
}

export default OpenSeaHead
