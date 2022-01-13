import React from 'react';
import { path } from 'ramda';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../../../../Button';
import HtmlText from '../../../../HtmlText';
import PushableDefault from '../../../../PushManager/PushableDefault';
import PushableChangePercent
  from '../../../../PushManager/PushableChangePercent';
import PushableTimestamp from '../../../../PushManager/PushableTimestamp';
import './ActiveFilterItem.scss';
import { FILTER_LEVEL_SECOND } from '../../ProductFilters.helper';

function ActiveFilterItem(props) {
  const {
    data, onItemClick, filterKey, filterLevel, clickable, className, color,
  } = props;

  const onClick = () => {
    if (clickable) {
      onItemClick(data.value, filterKey, filterLevel, data.additionalData);
    }
  };

  const getPushableChangePercentDateTime = () => {
    if (data) {
      const baseValue = String(path(['pushValue', 'baseValue'])(data));
      const value = String(path(['pushValue', 'value'])(data));
      if (baseValue !== value) {
        return (
          <>
            <PushableChangePercent field={data.pushValue} />
            <PushableTimestamp field={data.pushValue} />
          </>
        );
      }
      return (
        <PushableTimestamp
          field={data.pushValue}
          format="DD.MM.YYYY HH:mm:ss"
        />
      );
    }
    return null;
  };

  return (
    <Button
      color={color}
      size={BUTTON_SIZE.SMALL}
      className={classNames('ActiveFilterItem', className, clickable ? 'clickable' : '')}
      onClick={onClick}
    >
      <HtmlText className="label" tag="span" data={{ text: data.label }} />
      {data && data.pushValue && (
        <>
          <span className="pipe-separator">|</span>
          <PushableDefault field={data.pushValue} />
          {getPushableChangePercentDateTime()}
        </>
      )}
      {clickable && (
        <i className="icon-close" />
      )}
    </Button>
  );
}

ActiveFilterItem.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  onItemClick: PropTypes.func,
  filterKey: PropTypes.string.isRequired,
  filterLevel: PropTypes.string,
  clickable: PropTypes.bool,
  color: PropTypes.string,
};

ActiveFilterItem.defaultProps = {
  className: '',
  data: {},
  onItemClick: () => {},
  clickable: true,
  filterLevel: FILTER_LEVEL_SECOND,
  color: BUTTON_COLOR.STANDARD,
};

export default React.memo(ActiveFilterItem);
