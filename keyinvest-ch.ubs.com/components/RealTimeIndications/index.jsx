import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import i18n from '../../utils/i18n';
import Logger from '../../utils/logger';
import IndicatorTile from './IndicatorTile';
import './RealTimeIndications.scss';

function RealTimeIndications({ data, className }) {
  let indicationTiles = [];
  if (data && data.items) {
    indicationTiles = data.items.map((field) => (
      <IndicatorTile
        className="col-auto"
        key={field.id}
        field={field}
      />
    ));
  }

  const isHomePageMode = () => {
    try {
      if (window.location
        && window.location.pathname
        && window.location.pathname === '/') {
        return true;
      }
    } catch (e) {
      Logger.warn('RealTimeIndications', 'isHomePageMode', e);
    }
    return false;
  };

  return (
    <div className={classNames('RealTimeIndications', className)}>
      <Row className="note">{i18n.t('ubs_top_quotes_indications')}</Row>
      <Row className={classNames('d-flex justify-content-around wrapper', isHomePageMode() ? 'home-mode' : '')}>
        {indicationTiles}
      </Row>
    </div>
  );
}
RealTimeIndications.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};

RealTimeIndications.defaultProps = {
  className: '',
  data: {
    items: [],
  },
};
export default React.memo(RealTimeIndications);
