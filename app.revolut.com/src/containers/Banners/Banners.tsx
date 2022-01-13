import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { BannersList } from '../../components/Banner'
import { StateType } from '../../redux/reducers'
import * as actionCreator from '../../redux/reducers/banners'
import { addToClosedBanners } from '../../helpers/utils'

type MapActionsToProps = typeof actionCreator
type Props = RouteComponentProps & MapStateToProps & MapActionsToProps

const mapStateToProps = (state: StateType) => ({
  banners: state.banners,
})
type MapStateToProps = ReturnType<typeof mapStateToProps>

const enhance = connect<MapStateToProps, MapActionsToProps>(
  mapStateToProps,
  actionCreator
)
class BannersComponent extends React.Component<Props> {
  static defaultProps = {
    banners: [],
  }

  getBanners = () =>
    this.props.banners.map((banner) => {
      const {
        title,
        text,
        availablePath,
        forbiddenPath,
        important,
        ...bannerComponentData
      } = banner

      const isHidden = !!(
        availablePath &&
        !availablePath.test(this.props.location.pathname) &&
        (!forbiddenPath || forbiddenPath.test(this.props.location.pathname))
      )

      return {
        ...bannerComponentData,
        bannerText: text,
        bannerTitle: title,
        onClose: important
          ? null
          : () => {
              this.props.removeBanner(banner.id)
              addToClosedBanners(banner.id)
            },
        isHidden,
      }
    })

  render() {
    return <BannersList banners={this.getBanners()} />
  }
}

export const Banners = withRouter(enhance(BannersComponent))
