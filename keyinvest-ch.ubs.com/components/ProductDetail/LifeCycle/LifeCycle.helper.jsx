import { concat } from 'ramda';

export const LIFE_CYCLE_TODAY_KEY = 'today';
export const EVENT_POSITION_X = {
  RIGHT: 'position-right',
  LEFT: 'position-left',
  MIDDLE: 'position-middle',
};
export const EVENT_POSITION_Y = {
  UP: 'position-up',
  DOWN: 'position-down',
};
export const EVENT_STYLE_OPTIONS = {
  HIGHLIGHTED_RED: 'highlighted red',
  HIGHLIGHTED_BLACK: 'highlighted black',
  LAST: 'last',
  BLURRED: 'blurred',
  BLUR_ENDING_POINT: 'blur-end',
};

/**
 * Calculate CSS styling to display the floating event above the timeline
 * @param eventIndex
 * @param numberOfEvents
 * @returns {{styleProperty: string}}
 */
export const calculateEventPosition = (eventIndex, numberOfEvents) => {
  // Make sure the total count of events stays above 0
  const totalEvents = numberOfEvents > 0 ? numberOfEvents : 1;

  // Make sure eventIndex stays between 0 and less than numberOfEvents
  let index = eventIndex;
  if (!index || index < 0) {
    index = 0;
  }
  if (index >= totalEvents) {
    index = totalEvents - 1;
  }

  return { left: `calc(${(100 / totalEvents) * (index + 1)}% - 21px)` };
};

/**
 * Decide event position and style - return list of classes
 * @param index
 * @param numberOfEvents
 * @param todayIndex
 * @returns {[]}
 */
export const getEventClasses = (index, numberOfEvents, todayIndex) => {
  const eventClasses = [];

  let positionX = EVENT_POSITION_X.RIGHT;
  let positionY = EVENT_POSITION_Y.DOWN;
  let highlight;
  const otherClasses = [];

  // ODD, EVEN
  if (index % 2 === 0) {
    positionY = EVENT_POSITION_Y.UP;
  }

  // Event is the last element in the list
  if (index >= numberOfEvents - 1) {
    positionX = EVENT_POSITION_X.LEFT;
    highlight = EVENT_STYLE_OPTIONS.HIGHLIGHTED_BLACK;
    otherClasses.push(EVENT_STYLE_OPTIONS.LAST);
  }

  // Event is TODAY
  if (index === todayIndex) {
    if (index < numberOfEvents - 1) {
      positionX = EVENT_POSITION_X.MIDDLE;
    }
    highlight = EVENT_STYLE_OPTIONS.HIGHLIGHTED_RED;
    otherClasses.push(EVENT_STYLE_OPTIONS.BLUR_ENDING_POINT);
  }

  // Event position is before TODAY
  if (todayIndex !== null && todayIndex !== undefined && index < todayIndex) {
    otherClasses.push(EVENT_STYLE_OPTIONS.BLURRED);
  }

  eventClasses.push(positionX, positionY);

  if (highlight) {
    eventClasses.push(highlight);
  }

  return concat(eventClasses, otherClasses);
};

/**
 * Search the index in array of the object having a value in key
 * @param array
 * @param key
 * @param value
 * @returns {number}
 */
export const findIndexValueInListByKey = (array, key, value) => {
  if (array && array.length) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][key] === value) {
        return i;
      }
    }
  }
  return -1;
};
