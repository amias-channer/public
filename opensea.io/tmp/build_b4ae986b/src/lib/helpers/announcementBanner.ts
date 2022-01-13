import { announcementBannerQuery } from "../graphql/__generated__/announcementBannerQuery.graphql"
import { fetch, graphql } from "../graphql/graphql"

export const loadAnnouncementBanner = async () => {
  const data = await fetch<announcementBannerQuery>(
    graphql`
      query announcementBannerQuery {
        announcementBanner {
          text
          url
          heading
          headingMobile
          ctaText
          chain {
            id
            identifier
          }
          displayMode
        }
      }
    `,
    {},
  )
  return data ?? undefined
}
