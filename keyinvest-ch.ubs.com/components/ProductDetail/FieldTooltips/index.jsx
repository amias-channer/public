import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldTooltip from './FieldTooltip';
import { generateUniqId } from '../../../utils/utils';
import './FieldTooltips.scss';

const FieldTooltips = ({
  className,
  list,
  fieldKey,
}) => {
  if (!list) {
    return null;
  }

  if (list && Array.isArray(list) && list.length > 0) {
    return (
      <div className={classNames('FieldTooltips', className)}>
        {list.map((tooltip) => {
          const id = `Tooltip${generateUniqId()}`;
          return (
            <FieldTooltip
              key={id}
              uniqId={id}
              data={tooltip}
              placement="right"
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={classNames('FieldTooltips', className)}>
      <FieldTooltip
        data={list}
        uniqId={fieldKey}
        placement="right"
      />
    </div>
  );
};

FieldTooltips.propTypes = {
  className: PropTypes.string,
  fieldKey: PropTypes.string,
  list: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  ]),
};

FieldTooltips.defaultProps = {
  className: '',
  fieldKey: '',
  list: undefined,
};

export default React.memo(FieldTooltips);
