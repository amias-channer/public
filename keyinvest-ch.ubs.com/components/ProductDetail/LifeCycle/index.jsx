import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './LifeCycle.scss';
import {
  findIndexValueInListByKey,
  LIFE_CYCLE_TODAY_KEY,
} from './LifeCycle.helper';
import LifeCycleEvent from './LifeCycleEvent';

const LifeCycleCmp = ({
  className, events,
}) => {
  const todayIndex = findIndexValueInListByKey(events, 'key', LIFE_CYCLE_TODAY_KEY);
  return (
    <div className={classNames('LifeCycle', className)}>
      <div className="inner-wrapper">
        <div className="timeline" />
        {events.length > 0 && events.map((event, index) => (
          <LifeCycleEvent
            key={event.label + event.value}
            event={event}
            eventIndex={index}
            numberOfEvents={events.length}
            todayIndex={todayIndex}
          />
        ))}
      </div>
    </div>
  );
};
LifeCycleCmp.propTypes = {
  className: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.any),
};
LifeCycleCmp.defaultProps = {
  className: '',
  events: [],
};

const LifeCycle = React.memo(LifeCycleCmp);
export default LifeCycle;
