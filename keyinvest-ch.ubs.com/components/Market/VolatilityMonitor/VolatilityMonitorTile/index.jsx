import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col, Row } from 'reactstrap';
import i18n from '../../../../utils/i18n';
import './VolatilityMonitorTile.scss';
import PushableDefault from '../../../PushManager/PushableDefault';
import PushableChangePercent from '../../../PushManager/PushableChangePercent';
import PushableTimestamp from '../../../PushManager/PushableTimestamp';

function VolatilityMonitorTile(props) {
  const {
    className, data, onClick, isActive,
  } = props;
  const onTileClick = () => {
    onClick(data.sin.value);
  };
  return (
    <div
      role="presentation"
      className={classNames('VolatilityMonitorTile', className, (isActive ? 'active' : ''))}
      onClick={onTileClick}
    >
      {data && Object.keys(data).length > 0 && (
      <div className="wrapper">
        <Row>
          <Col className="col-8">
            <h2>{data.name.value}</h2>
            <Row>
              <Col xs="4">
                <PushableDefault
                  field={data.priceLow4Wk.value}
                  className="pushable-value pushable-value-decimal left"
                />
              </Col>
              <Col xs="4" />
              <Col xs="4">
                <PushableDefault
                  field={data.priceHigh4Wk.value}
                  className="pushable-value pushable-value-decimal right"
                />
              </Col>
            </Row>
            <Row className="low-high-section">
              <Col xs="4">
                {i18n.t('Low')}
              </Col>
              <Col xs="4">
                {i18n.t('30 Days')}
              </Col>
              <Col xs="4">
                {i18n.t('High')}
              </Col>
            </Row>
          </Col>
          <Col className="col-4">
            <PushableDefault field={data.price.value} className="pushable-value pushable-value-decimal" />
            <PushableChangePercent field={data.price.value} className="pushable-value pushable-value-percentage" />
          </Col>
        </Row>
        <Row>
          <Col>
            <span className="last-update">
              <span>
                {i18n.t('Last update:')}
                &nbsp;
              </span>
              <PushableTimestamp field={data.lastUpdate.value} showInitialValue />
            </span>
          </Col>
        </Row>
      </div>
      )}

    </div>
  );
}

VolatilityMonitorTile.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

VolatilityMonitorTile.defaultProps = {
  className: '',
  data: {},
  onClick: () => {},
  isActive: false,
};

export default VolatilityMonitorTile;
