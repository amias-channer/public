import React, { useState, useEffect } from 'react';
import Swiper from 'react-id-swiper';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  DESKTOP_MODE,
  MOBILE_MODE,
  TABLET_MODE,
} from '../../../utils/responsive';
import {
  DEFAULT_DURATION,
  getImageFullUrl,
  RESPONSIVE_IMAGES_KEY_MAPPING,
} from '../SceneSlider.helper';
import SliderContent from './SliderContent';

const ControlledSceneSlider = (props) => {
  const [imagesSwiper, getImagesSwiper] = useState(null);
  const [contentSwiper, getContentSwiper] = useState(null);
  const { data, responsiveMode, className } = props;
  const { slides } = data;
  const isMobileMode = responsiveMode === MOBILE_MODE || responsiveMode === TABLET_MODE;
  const imagesSwiperParams = {
    getSwiper: getImagesSwiper,
    loop: true,
    shouldSwiperUpdate: true,
    autoplay: {
      delay: DEFAULT_DURATION,
      disableOnInteraction: true,
    },
    pagination: !isMobileMode ? false : {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };
  const contentSwiperParams = {
    getSwiper: getContentSwiper,
    loop: true,
    shouldSwiperUpdate: true,
  };

  useEffect(() => {
    if (
      imagesSwiper !== null
      && imagesSwiper.controller
      && contentSwiper !== null
      && contentSwiper.controller
    ) {
      contentSwiper.controller.control = imagesSwiper;
      imagesSwiper.controller.control = contentSwiper;
    }
  }, [imagesSwiper, contentSwiper]);

  const getSlideContent = (item) => (
    <SliderContent
      key={item.id}
      captionText={item.text}
      captionTitle={item.title}
      primaryButtonTitle={item.buttonLabel}
      primaryButtonAlt={item.buttonAlt || item.buttonLabel}
      primaryButtonUrl={item.buttonUrl}
      secondaryButtonTitle={item.secondaryButtonLabel}
      secondaryButtonAlt={item.secondaryButtonAlt || item.secondaryButtonLabel}
      secondaryButtonUrl={item.secondaryButtonUrl}
      buttonsPosition={item.buttonsPosition}
    />
  );

  const slidesContentList = slides.map((item) => (
    <div className="swiper-slide" key={item.id} data-swiper-autoplay={item.duration ? item.duration : DEFAULT_DURATION}>
      <img
        className="slider-img"
        src={getImageFullUrl(item[RESPONSIVE_IMAGES_KEY_MAPPING[responsiveMode]])}
        alt={item.imageAlt || item.title}
      />
      {!isMobileMode && getSlideContent(item)}
    </div>
  ));

  const mobileSlidesContentList = slides.map((item) => (
    <div className="swiper-slide" key={item.id} data-swiper-autoplay={item.duration ? item.duration : DEFAULT_DURATION}>
      {getSlideContent(item)}
    </div>
  ));
  const handleMouseEnter = () => {
    if (imagesSwiper && imagesSwiper.autoplay && typeof imagesSwiper.autoplay.stop === 'function') {
      imagesSwiper.autoplay.stop();
    }
  };
  const handleMouseLeave = () => {
    if (imagesSwiper && imagesSwiper.autoplay && typeof imagesSwiper.autoplay.start === 'function') {
      imagesSwiper.autoplay.start();
    }
  };
  return (
    <div
      className={classNames('SceneSlider', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Swiper {...imagesSwiperParams}>
        {slidesContentList}
      </Swiper>

      {isMobileMode && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Swiper {...contentSwiperParams}>
          {mobileSlidesContentList}
        </Swiper>
      )}
    </div>
  );
};

ControlledSceneSlider.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  responsiveMode: PropTypes.string,
};

ControlledSceneSlider.defaultProps = {
  className: '',
  responsiveMode: DESKTOP_MODE,
  data: {
    slides: [],
  },
};
export default ControlledSceneSlider;
