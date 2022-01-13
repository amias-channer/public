import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import './MonthYearPicker.scss';
import Scrollbars from 'react-custom-scrollbars';
import YearMonthsSection from './YearMonthsSection';
import { MONTHS_PER_ROW } from '../FilterMonthsPicker.helper';
import i18n from '../../../../utils/i18n';

const MonthsPicker = ({
  years, months, selectedMonths, enabledMonths, onMonthSelected, monthsShortToNumericMap,
}) => (
  <div className="MonthYearPicker">
    <Row className="mt-3">
      <div className="col-12 title">{i18n.t('please_select_month')}</div>
      <Scrollbars
        autoHeight
        autoHeightMin={190}
        autoHeightMax={352}
      >
        {years.map(
          (year) => (
            <YearMonthsSection
              key={year}
              months={months}
              monthsShortToNumericMap={monthsShortToNumericMap}
              year={year}
              monthsPerRow={MONTHS_PER_ROW}
              selectedMonths={selectedMonths}
              enabledMonths={enabledMonths}
              onMonthSelected={onMonthSelected}
            />
          ),
        )}
      </Scrollbars>
    </Row>
  </div>
);

MonthsPicker.propTypes = {
  years: PropTypes.arrayOf(PropTypes.any),
  months: PropTypes.arrayOf(PropTypes.any),
  selectedMonths: PropTypes.arrayOf(PropTypes.any),
  enabledMonths: PropTypes.arrayOf(PropTypes.any),
  monthsShortToNumericMap: PropTypes.objectOf(PropTypes.any),
  onMonthSelected: PropTypes.func,
};

MonthsPicker.defaultProps = {
  years: [],
  months: [],
  selectedMonths: [],
  enabledMonths: [],
  onMonthSelected: () => {},
  monthsShortToNumericMap: {},
};

export default React.memo(MonthsPicker);
