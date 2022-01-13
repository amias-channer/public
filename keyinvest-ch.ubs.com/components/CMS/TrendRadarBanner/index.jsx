import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import { connect } from 'react-redux';
import Image from '../../Image';
import {
  DESKTOP_MODE,
  MOBILE_MODE,
  NOTEBOOK_MODE,
  TABLET_MODE,
} from '../../../utils/responsive';
import getAppConfig from '../../../main/AppConfig';
import { ENV_DEV } from '../../../utils/utils';
import './TrendRadarBanner.scss';

const imagePropertyMapping = {
  [MOBILE_MODE]: 'mobile-image',
  [TABLET_MODE]: 'tablet-image',
  [NOTEBOOK_MODE]: 'notebook-image',
  [DESKTOP_MODE]: 'desktop-image',
};

const getImageAltText = (data) => pathOr('', ['banner', 'alt'])(data);
const getLink = (data) => pathOr('', ['banner', 'link'])(data);

const getImageFullUrl = (data, responsiveMode) => {
  const appConfig = getAppConfig();
  const src = pathOr('', ['banner', imagePropertyMapping[responsiveMode]])(data);
  if (appConfig.environment === ENV_DEV) {
    return `//${appConfig.hostname}${src}`;
  }
  return src;
};

export function TrendRadarBannerCmp(props) {
  const { data, className, responsiveMode } = props;
  return (
    <a href={getLink(data)} target="_blank" rel="noreferrer noopener">
      <Image
        className={classNames('TrendRadarBanner', className)}
        altText={getImageAltText(data)}
        source={getImageFullUrl(data, responsiveMode)}
      />
    </a>
  );
}

TrendRadarBannerCmp.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  responsiveMode: PropTypes.string,
};

TrendRadarBannerCmp.defaultProps = {
  data: {},
  className: '',
  responsiveMode: DESKTOP_MODE,
};

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});

export default React.memo(connect(mapStateToProps)(TrendRadarBannerCmp));
