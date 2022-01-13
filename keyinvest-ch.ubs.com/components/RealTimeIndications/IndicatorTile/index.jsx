import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './IndicatorTile.scss';
import PushableDefault from '../../PushManager/PushableDefault';
import PushableChangePercent from '../../PushManager/PushableChangePercent';
import {
  dispatchAnalyticsClickTrack, NETCENTRIC_CTA_TYPE_INDICATOR_TILE,
} from '../../../analytics/Analytics.helper';

function IndicatorTile(props) {
  const { className, field } = props;
  const onTileClick = () => {
    dispatchAnalyticsClickTrack(
      field.instrumentLabel,
      field.instrumentLink,
      NETCENTRIC_CTA_TYPE_INDICATOR_TILE,
      'RealTimeIndications',
    );
  };
  return (
    <div className={classNames('IndicatorTile', className)}>
      <a className="inner-wrapper" href={field.instrumentLink} onClick={onTileClick}>
        <div className="name">{field.instrumentLabel}</div>
        <div className="values">
          <div className="pushable-val"><PushableDefault field={field} /></div>
          <PushableChangePercent field={field} />
        </div>
      </a>
    </div>
  );
}

IndicatorTile.propTypes = {
  className: PropTypes.string,
  field: PropTypes.objectOf(PropTypes.any),
};

IndicatorTile.defaultProps = {
  className: 'col-lg-2',
  field: {},
};

export default React.memo(IndicatorTile);
