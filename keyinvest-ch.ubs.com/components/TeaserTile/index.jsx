import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import DeriRiskIndicatorTile from '../Market/DeriRiskIndicator/DeriRiskIndicatorTile';
import VolatilityMonitorTile from '../Market/VolatilityMonitor/VolatilityMonitorTile';

const TILE_DERI = 'DERI';
const TILE_GEM_DERI = 'GEM DERI';
const TILE_VDAX_NEW = 'VDAX-NEW';
const TILE_VIX = 'VIX';
const TILE_VSMI = 'VSMI';

function TeaserTile(props) {
  const { data, className } = props;
  const getTile = () => {
    const nameShort = path(['indicatorData', 'nameShort', 'value'])(data);
    if (nameShort) {
      switch (nameShort) {
        case TILE_DERI:
        case TILE_GEM_DERI:
          return (<DeriRiskIndicatorTile data={data.indicatorData} />);
        case TILE_VIX:
        case TILE_VSMI:
        case TILE_VDAX_NEW:
          return (<VolatilityMonitorTile data={data.indicatorData} />);
        default:
          return null;
      }
    }
    return null;
  };
  return (
    <div className={classNames('TeaserTile', className)}>
      {getTile()}
    </div>
  );
}

TeaserTile.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
};

TeaserTile.defaultProps = {
  className: '',
  data: {
    indicatorData: {
      nameShort: {
        value: '',
      },
    },
  },
};

export default React.memo(TeaserTile);
