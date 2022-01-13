import React from 'react';
import MediaQuery from 'react-responsive';
import 'swiper/swiper.scss';
import './SceneSlider.scss';
import PropTypes from 'prop-types';
import {
  DESKTOP_MODE,
  MOBILE_MODE,
  NOTEBOOK_MODE,
  TABLET_MODE,
} from '../../utils/responsive';
import mediaQueries from '../../utils/mediaQueries';
import ControlledSceneSlider from './ControlledSceneSlider';

class SceneSlider extends React.PureComponent {
  render() {
    const { data, className } = this.props;
    return (
      <>
        <MediaQuery query={mediaQueries.mobileOnly}>
          <ControlledSceneSlider className={className} data={data} responsiveMode={MOBILE_MODE} />
        </MediaQuery>

        <MediaQuery query={mediaQueries.tabletOnly}>
          <ControlledSceneSlider className={className} data={data} responsiveMode={TABLET_MODE} />
        </MediaQuery>

        <MediaQuery query={mediaQueries.notebookOnly}>
          <ControlledSceneSlider className={className} data={data} responsiveMode={NOTEBOOK_MODE} />
        </MediaQuery>

        <MediaQuery query={mediaQueries.desktop}>
          <ControlledSceneSlider className={className} data={data} responsiveMode={DESKTOP_MODE} />
        </MediaQuery>
      </>
    );
  }
}

SceneSlider.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};

SceneSlider.defaultProps = {
  className: '',
  data: {
    slides: [],
  },
};
export default SceneSlider;
