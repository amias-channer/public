import * as React from 'react'
import { connect } from 'react-redux'

import { BannerResponseType } from '../../api/ticketTypes'
import * as actionCreator from '../../redux/reducers/banners'
import { TICKET_BANNER } from '../../constants/banners'
import { inClosedBanners } from '../../helpers/utils'

type OwnProps = {
  banner: BannerResponseType | null
}
type MapActionsToProps = typeof actionCreator
type Props = OwnProps & MapActionsToProps

const enhance = connect<null, MapActionsToProps>(null, actionCreator)
class ChatBannersClass extends React.Component<Props> {
  static defaultProps = {
    banner: null,
  }

  componentDidMount() {
    const { banner } = this.props

    if (banner && !inClosedBanners(banner.updateTime)) {
      this.props.addBanner({
        ...TICKET_BANNER,
        id: banner.updateTime,
        text: banner.text,
      })
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { banner } = this.props

    if (prevProps.banner !== banner) {
      if (banner && !inClosedBanners(banner.updateTime)) {
        this.props.addBanner({
          ...TICKET_BANNER,
          id: banner.updateTime,
          text: banner.text,
        })
      }
    }
  }

  componentWillUnmount() {
    const { banner } = this.props
    if (banner) {
      this.props.removeBanner(TICKET_BANNER.id)
    }
  }

  render() {
    return null
  }
}

export const ChatBanners = enhance(ChatBannersClass)
