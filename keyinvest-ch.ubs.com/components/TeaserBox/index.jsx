import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import HtmlText from '../HtmlText';
import getAppConfig from '../../main/AppConfig';
import './TeaserBox.scss';
import ArrowedLink from '../ArrowedLink';
import {
  DESKTOP_MODE, MOBILE_MODE, NOTEBOOK_MODE, TABLET_MODE,
} from '../../utils/responsive';
import { ENV_DEV } from '../../utils/utils';
import {
  dispatchAnalyticsClickTrack,
  NETCENTRIC_CTA_TYPE_TEXT_LINK,
} from '../../analytics/Analytics.helper';

const responsiveImgKeyMapping = {
  [DESKTOP_MODE]: 'image-desktop',
  [NOTEBOOK_MODE]: 'image-notebook',
  [TABLET_MODE]: 'image-tablet',
  [MOBILE_MODE]: 'image-mobile',
};
export const TeaserBoxComponent = (props) => {
  const { data, responsiveMode, className } = props;

  const getImageFullUrl = (item) => {
    const appConfig = getAppConfig();
    if (appConfig.environment === ENV_DEV) {
      return `//${appConfig.hostname}${item[responsiveImgKeyMapping[responsiveMode]]}`;
    }
    return item[responsiveImgKeyMapping[responsiveMode]];
  };

  const onClick = (e, link, label) => {
    dispatchAnalyticsClickTrack(
      label,
      link,
      NETCENTRIC_CTA_TYPE_TEXT_LINK,
      'Teaser Box',
    );
  };

  const itemTextBlock = (item) => (
    <div className="col-lg-6 teaser-block text-block">
      <HtmlText className="teaser-headline" data={{ text: item.headline }} />
      <HtmlText className="teaser-text" data={{ text: item.text }} />
      <div className="teaser-links">
        {item['first-label'] && (
          <div><ArrowedLink onClick={onClick} url={item['first-url']} label={item['first-label']} /></div>
        )}
        {item['second-label'] && (
          <div><ArrowedLink onClick={onClick} url={item['second-url']} label={item['second-label']} /></div>
        )}
      </div>
    </div>
  );

  const itemImageBlock = (item) => (
    <div className="col-lg-6 teaser-block image-block">
      <img className="teaser-img" src={getImageFullUrl(item)} alt={item['image-description']} />
    </div>
  );

  const getTeaserBoxes = (items) => items.map((item, index) => (
    <div key={item.id} className={`item row ${index % 2 !== 0 ? 'reversed flex-lg-row-reverse' : ''}`}>
      {itemImageBlock(item)}
      {itemTextBlock(item)}
    </div>
  ));
  return (
    <div className={classNames('TeaserBox', className)}>
      {getTeaserBoxes(data.items)}
    </div>
  );
};

TeaserBoxComponent.propTypes = {
  responsiveMode: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
};
TeaserBoxComponent.defaultProps = {
  responsiveMode: DESKTOP_MODE,
  className: '',
  data: {
    items: [],
  },
};

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});

export default connect(mapStateToProps)(TeaserBoxComponent);
