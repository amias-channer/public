import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Swiper from 'react-id-swiper';
import { generateYears, isYearInDates } from './YearSelector.helper';
import ClickableItem from '../ClickableItem';
import './YearSelector.scss';
import { getMoment } from '../../../Filters.helper';

const YearSelector = ({
  active, min, max, onSelect, className, activeDates, enabledDates, disabledDates,
}) => {
  const thisYear = getMoment().year();
  const years = generateYears(thisYear, min, max);
  const params = {
    slidesPerView: 5,
    freeMode: true,
    spaceBetween: 0,
    grabCursor: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };
  return (
    <div className={classNames('YearSelector', className)}>
      {active && years && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Swiper {...params} activeSlideKey={`${active}`}>
          {years.map((year) => (
            <div key={year}>
              <ClickableItem
                className=""
                onClick={onSelect}
                value={year}
                label={year}
                isDisabled={isYearInDates(year, disabledDates)
                || !isYearInDates(year, enabledDates)}
                isActive={active === year || isYearInDates(year, activeDates)}
              />
            </div>
          ))}
        </Swiper>
      )}
    </div>
  );
};

YearSelector.propTypes = {
  active: PropTypes.number,
  activeDates: PropTypes.arrayOf(PropTypes.any),
  enabledDates: PropTypes.arrayOf(PropTypes.any),
  disabledDates: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onSelect: PropTypes.func,
};

YearSelector.defaultProps = {
  active: getMoment().year(),
  activeDates: [],
  enabledDates: [],
  disabledDates: [],
  className: '',
  max: null,
  min: null,
  onSelect: () => {},
};

export default React.memo(YearSelector);
