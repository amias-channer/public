import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ThemeDetailsTableMobileRow.scss';
import i18n from '../../../../../utils/i18n';
import PushableDefault from '../../../../PushManager/PushableDefault';

const ThemeDetailsTableMobileRow = ({ rowData, className }) => (
  <div className={classNames('ThemeDetailsTableMobileRow', className)}>
    <div className="inner-row-wrapper">
      <div className="title">
        {rowData.currency}
        {' '}
        {i18n.t('tracker')}
      </div>
      <div className="identifier field-value text-center">
        {rowData.isin}
      </div>
      <div className="row">
        <div className="bid col-6">
          <div className="field-name">{i18n.t('bid')}</div>
          <PushableDefault className="field-value" field={rowData.bid} />
        </div>
        <div className="ask col-6">
          <div className="field-name">{i18n.t('ask')}</div>
          <PushableDefault className="field-value" field={rowData.ask} />
        </div>
      </div>
    </div>
  </div>
);

ThemeDetailsTableMobileRow.propTypes = {
  rowData: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};

ThemeDetailsTableMobileRow.defaultProps = {
  rowData: {},
  className: '',
};

export default React.memo(ThemeDetailsTableMobileRow);
