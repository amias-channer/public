import React from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import './AlertFormSelectedItem.scss';
import PushableTimestamp from '../../../../PushManager/PushableTimestamp';
import PushableChangePercent
  from '../../../../PushManager/PushableChangePercent';
import PushableDefault from '../../../../PushManager/PushableDefault';

const getPushableField = (data) => path(['pushValue'], data);

const AlertFormSelectedItem = ({ keyText, data, shouldDisplayKeyText }) => {
  const pushableField = getPushableField(data);

  const getPushableChangePercentDateTime = (pushData) => {
    if (pushData) {
      const baseValue = String(path(['baseValue'])(pushData));
      const value = String(path(['value'])(pushData));
      if (baseValue !== value) {
        return (
          <>
            <PushableChangePercent field={pushData} />
            <PushableTimestamp field={pushData} />
          </>
        );
      }
      return (
        <PushableTimestamp
          field={pushData}
          format="DD.MM.YYYY HH:mm:ss"
        />
      );
    }
    return null;
  };

  return (
    <div className="AlertFormSelectedItem">
      {keyText && (
        <>
          {shouldDisplayKeyText !== false && (<strong>{keyText}</strong>)}
          {' '}
          {data.label}
        </>
      )}
      {!keyText && (
        <strong>{data.label}</strong>
      )}
      {pushableField && (
      <>
        <span className="pipe-separator">|</span>
        <PushableDefault field={pushableField} />
        {getPushableChangePercentDateTime(pushableField)}
      </>
      )}
    </div>
  );
};

AlertFormSelectedItem.propTypes = {
  keyText: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  shouldDisplayKeyText: PropTypes.bool,
};

AlertFormSelectedItem.defaultProps = {
  keyText: '',
  data: {},
  shouldDisplayKeyText: true,
};

export default React.memo(AlertFormSelectedItem);
