import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import i18n from '../../../utils/i18n';
import './ChartUnderlyingDisclaimer.scss';

const ChartUnderlyingDisclaimer = ({ className }) => (
  <div className={classNames('ChartUnderlyingDisclaimer', className)}>
    {i18n.t('underlying_chart_disclaimer')}
  </div>
);

ChartUnderlyingDisclaimer.propTypes = {
  className: PropTypes.string,
};
ChartUnderlyingDisclaimer.defaultProps = {
  className: '',
};
export default React.memo(ChartUnderlyingDisclaimer);
