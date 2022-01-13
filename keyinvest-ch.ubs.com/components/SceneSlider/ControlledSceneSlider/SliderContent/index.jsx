import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import HtmlText from '../../../HtmlText';
import './SliderContent.scss';
import {
  dispatchAnalyticsClickTrack,
  NETCENTRIC_CTA_TYPE_PRIMARY_BUTTON, NETCENTRIC_CTA_TYPE_SECONDARY_BUTTON,
} from '../../../../analytics/Analytics.helper';
import { SCENE_SLIDER_ANALYTICS_NAME } from '../../SceneSlider.helper';

const SliderContent = ({
  captionTitle,
  captionText,
  primaryButtonTitle,
  primaryButtonAlt,
  primaryButtonUrl,
  secondaryButtonTitle,
  secondaryButtonAlt,
  secondaryButtonUrl,
  buttonsPosition,
}) => {
  const trackPrimaryButton = () => {
    dispatchAnalyticsClickTrack(
      primaryButtonTitle,
      primaryButtonUrl,
      NETCENTRIC_CTA_TYPE_PRIMARY_BUTTON,
      SCENE_SLIDER_ANALYTICS_NAME,
    );
  };
  const trackSecondaryButton = () => {
    dispatchAnalyticsClickTrack(
      secondaryButtonTitle,
      secondaryButtonUrl,
      NETCENTRIC_CTA_TYPE_SECONDARY_BUTTON,
      SCENE_SLIDER_ANALYTICS_NAME,
    );
  };
  return (
    <div className="SliderContent">
      <div className="contents">
        <div className="title">{captionTitle}</div>
        <div className="text"><HtmlText data={{ text: captionText }} /></div>
      </div>
      <div className={classNames('buttons', buttonsPosition)}>
        {secondaryButtonTitle && (
        <Button
          tag="a"
          href={secondaryButtonUrl}
          title={secondaryButtonAlt}
          color="gray"
          className="slider-secondary-btn"
          onClick={trackSecondaryButton}
        >
          {secondaryButtonTitle}
        </Button>
        )}
        {primaryButtonTitle && (
        <Button
          tag="a"
          href={primaryButtonUrl}
          title={primaryButtonAlt}
          color="green"
          className="btn-arrowed slider-primary-btn"
          onClick={trackPrimaryButton}
        >
          {primaryButtonTitle}
        </Button>
        )}
      </div>
    </div>
  );
};

SliderContent.defaultProps = {
  captionTitle: '',
  captionText: '',
  primaryButtonTitle: '',
  primaryButtonUrl: '',
  primaryButtonAlt: '',
  secondaryButtonTitle: '',
  secondaryButtonUrl: '',
  secondaryButtonAlt: '',
  buttonsPosition: 'right',
};

SliderContent.propTypes = {
  captionTitle: PropTypes.string,
  captionText: PropTypes.string,
  primaryButtonTitle: PropTypes.string,
  primaryButtonUrl: PropTypes.string,
  primaryButtonAlt: PropTypes.string,
  secondaryButtonTitle: PropTypes.string,
  secondaryButtonUrl: PropTypes.string,
  secondaryButtonAlt: PropTypes.string,
  buttonsPosition: PropTypes.string,
};

export default React.memo(SliderContent);
