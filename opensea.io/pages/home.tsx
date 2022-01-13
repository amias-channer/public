import React from "react"
import { graphql } from "react-relay"
import TrendingCollections from "../components/common/TrendingCollections.react"
import AnnouncementBanner from "../components/layout/home-page/AnnouncementBanner.react"
import BackedBy from "../components/layout/home-page/BackedBy.react"
import BrowseCategories from "../components/layout/home-page/BrowseCategories.react"
import Featured from "../components/layout/home-page/Featured.react"
import FromBlog from "../components/layout/home-page/FromBlog.react"
import GettingStarted from "../components/layout/home-page/GettingStarted.react"
import Promotions from "../components/layout/home-page/Promotions.react"
import DelistedNoticeModal from "../components/modals/DelistedNoticeModal.react"
import AppContainer from "../containers/AppContainer.react"
import Block from "../design-system/Block"
import Modal from "../design-system/Modal"
import { trackHomePage } from "../lib/analytics/events/pageEvents"
import { homeQuery } from "../lib/graphql/__generated__/homeQuery.graphql"
import { GraphQLInitialProps } from "../lib/graphql/graphql"
import GraphQLPage from "../lib/graphql/GraphQLPage.react"
import Router from "../lib/helpers/router"
import QP from "../lib/qp/qp"
import { getIsTestnet } from "../store"

export default class Home extends GraphQLPage<homeQuery> {
  static getInitialProps = (): GraphQLInitialProps<homeQuery> => ({
    cacheMaxAge: 60 * 5,
    variables: {},
  })

  static query = graphql`
    query homeQuery {
      promotions {
        ...Promotions_promotions
      }
      featuredAsset {
        ...Featured_data
      }
    }
  `

  componentDidMount() {
    trackHomePage()
  }

  renderContent() {
    const { data } = this.props
    const promotions = data?.promotions
    const isTestnet = getIsTestnet()

    return (
      <Block>
        <Featured data={data?.featuredAsset ?? null} />
        {!isTestnet ? (
          <>
            <Promotions promotions={promotions ?? null} />
            <TrendingCollections />
          </>
        ) : null}
        <GettingStarted />
        <FromBlog />
        <BrowseCategories />
        <BackedBy />
      </Block>
    )
  }

  render() {
    const showDelistedNotice = QP.parse({
      show_delisted_notice: QP.Optional(QP.boolean),
    }).show_delisted_notice
    const { announcementBanner, updateContext } = this.context
    const announcement = announcementBanner?.announcementBanner
    const isHomeAnnouncement = announcement?.displayMode == "HOMEPAGE_ONLY"

    return (
      <>
        {isHomeAnnouncement && announcement != null && (
          <AnnouncementBanner
            ctaText={announcement.ctaText}
            heading={announcement.heading}
            headingMobile={announcement.headingMobile}
            text={announcement.text}
            url={announcement.url ?? ""}
            onClose={() => updateContext({ announcementBanner: undefined })}
          />
        )}

        <AppContainer isLanding isPageAnnouncementShown={isHomeAnnouncement}>
          {this.renderContent()}

          {showDelistedNotice && (
            <Modal isOpen>
              <DelistedNoticeModal
                variant="home"
                onClose={() => Router.push("/")}
              />
            </Modal>
          )}
        </AppContainer>
      </>
    )
  }
}
