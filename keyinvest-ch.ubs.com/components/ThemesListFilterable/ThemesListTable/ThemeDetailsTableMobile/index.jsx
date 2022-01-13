import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ThemeDetailsTableMobileRow from './ThemeDetailsTableMobileRow';
import './ThemeDetailsTableMobile.scss';

const ThemeDetailsTableMobile = ({ data, className }) => (
  <div className={classNames('ThemeDetailsTableMobile', className)}>
    {data.map((row) => (
      <ThemeDetailsTableMobileRow className="mb-3 col-md-4 mb-md-0" key={row.isin} rowData={row} />
    ))}
  </div>
);

ThemeDetailsTableMobile.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
};

ThemeDetailsTableMobile.defaultProps = {
  data: [],
  className: '',
};

export default React.memo(ThemeDetailsTableMobile);
