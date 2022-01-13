import { maxBy, reduce } from 'ramda';

// eslint-disable-next-line import/prefer-default-export
export const getMaxTimestamp = (listOfTimestamps) => (
  Array.isArray(listOfTimestamps) ? reduce(maxBy(Number), 0, listOfTimestamps) : 0
);
