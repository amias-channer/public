import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './LifeCycleEvent.scss';
import {
  calculateEventPosition,
  getEventClasses,
} from '../LifeCycle.helper';
import HtmlText from '../../../HtmlText';

const LifeCycleEvent = ({
  className,
  event,
  eventIndex,
  numberOfEvents,
  todayIndex,
}) => (
  <div
    className={classNames(
      'LifeCycleEvent',
      className,
      getEventClasses(eventIndex, numberOfEvents, todayIndex),
    )}
    style={calculateEventPosition(eventIndex, numberOfEvents)}
  >
    <div className="point" />
    <div className="content">
      {event && event.label && (
        <HtmlText tag="span" className="label" data={{ text: event.label }} />
      )}
      {event && event.value && (
        <span className="value">{event.value}</span>
      )}
    </div>
  </div>
);

LifeCycleEvent.propTypes = {
  className: PropTypes.string,
  event: PropTypes.objectOf(PropTypes.any),
  eventIndex: PropTypes.number,
  numberOfEvents: PropTypes.number,
  todayIndex: PropTypes.number,
};
LifeCycleEvent.defaultProps = {
  className: '',
  event: null,
  eventIndex: null,
  numberOfEvents: 0,
  todayIndex: null,
};

export default React.memo(LifeCycleEvent);
