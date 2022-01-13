import { path, pathOr } from 'ramda';
import classNames from 'classnames';
import {
  formatNumber as globalFormatNumber,
  parseNumber,
} from '../../../utils/utils';

export const IDENTIFIER_PROPERTY = 'sin';
export const DEFAULT_DECIMAL_DIGITS = 2;
export const EMPTY_VALUE = '--';

export const PUSHABLE_DISPLAY_MODE = {
  SIZE: 'size',
  TIMESTAMP: 'timestamp',
  CHANGE_PERCENT: 'diff changePercent',
  CHANGE_PERCENT_WITH_BAR: 'diff changePercent percentBar',
  CHANGE_ABSOLUTE: 'diff changeAbsolute',
  VALUE: 'value',
  COLOR_BAR: 'colorBar',
  CHART_UPDATER: 'chartUpdater',
};

export const PUSHABLE_CLASS = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
};
export const PUSHABLE_TICK_CLASS = {
  POSITIVE: 'tick-positive',
  NEGATIVE: 'tick-negative',
  NEUTRAL: 'tick-neutral',
};

export const PUSHABLE_CHART_TICK_CLASS = {
  POSITIVE: 'chart-tick-positive',
  NEGATIVE: 'chart-tick-negative',
  NEUTRAL: 'chart-tick-neutral',
};

export const getPerformanceClass = (value) => {
  let trendClass = '';
  if (value > 0.009) {
    trendClass = 'positive-100';
  } else if (value > 0.008) {
    trendClass = 'positive-090';
  } else if (value > 0.007) {
    trendClass = 'positive-080';
  } else if (value > 0.006) {
    trendClass = 'positive-070';
  } else if (value > 0.005) {
    trendClass = 'positive-060';
  } else if (value > 0.004) {
    trendClass = 'positive-050';
  } else if (value > 0.003) {
    trendClass = 'positive-040';
  } else if (value > 0.002) {
    trendClass = 'positive-030';
  } else if (value > 0.001) {
    trendClass = 'positive-020';
  } else if (value > 0.000) {
    trendClass = 'positive-010';
  } else if (value === 0.0) {
    trendClass = 'neutral';
  } else if (value > -0.001) {
    trendClass = 'negative-010';
  } else if (value > -0.002) {
    trendClass = 'negative-020';
  } else if (value > -0.003) {
    trendClass = 'negative-030';
  } else if (value > -0.004) {
    trendClass = 'negative-040';
  } else if (value > -0.005) {
    trendClass = 'negative-050';
  } else if (value > -0.006) {
    trendClass = 'negative-060';
  } else if (value > -0.007) {
    trendClass = 'negative-070';
  } else if (value > -0.008) {
    trendClass = 'negative-080';
  } else if (value > -0.009) {
    trendClass = 'negative-090';
  } else {
    trendClass = 'negative-100';
  }
  let sign = PUSHABLE_CLASS.NEUTRAL;
  if (value < 0) {
    sign = PUSHABLE_CLASS.NEGATIVE;
  } else if (value > 0) {
    sign = PUSHABLE_CLASS.POSITIVE;
  }
  return `${sign} trend-${trendClass}`;
};

export const getMarketsInstrumentClasses = (val) => {
  const resultClasses = [];

  let trendNegative = 'trend-negative-';
  let trendPositive = 'trend-positive-';
  const trendNeutral = 'trend-neutral';
  const trendNoData = 'trend-no-data';
  const value = Number(val);
  if (value <= 0) {
    if (value === EMPTY_VALUE) {
      resultClasses.push(trendNoData);
    } else if (value === 0) {
      resultClasses.push(`${trendNeutral}-gray`);
    } else if (value <= -0.5) {
      resultClasses.push(`${trendNegative}white`);
    } else {
      resultClasses.push(`${trendNegative}black`);
    }

    if (value <= -0.9 || value < -1) {
      trendNegative += '100';
    } else if (value <= -0.8) {
      trendNegative += '090';
    } else if (value <= -0.7) {
      trendNegative += '080';
    } else if (value <= -0.6) {
      trendNegative += '070';
    } else if (value <= -0.5) {
      trendNegative += '060';
    } else if (value <= -0.4) {
      trendNegative += '050';
    } else if (value <= -0.3) {
      trendNegative += '040';
    } else if (value <= -0.2) {
      trendNegative += '030';
    } else if (value <= -0.1) {
      trendNegative += '020';
    } else if (value < 0) {
      trendNegative += '010';
    } else if (value === 0) {
      trendNegative = trendNeutral;
    } else if (value === EMPTY_VALUE) {
      trendNegative = trendNoData;
    }

    resultClasses.push(trendNegative);
  } else {
    if (value === EMPTY_VALUE) {
      resultClasses.push(trendNoData);
    } else if (value === 0) {
      resultClasses.push(`${trendNeutral}-gray`);
    } else if (value <= 0.5) {
      resultClasses.push(`${trendPositive}black`);
    } else {
      resultClasses.push(`${trendPositive}white`);
    }

    if (value === EMPTY_VALUE) {
      trendPositive = trendNoData;
    } else if (value === 0) {
      trendPositive = trendNeutral;
    } else if (value <= 0.1) {
      trendPositive += '010';
    } else if (value <= 0.2) {
      trendPositive += '020';
    } else if (value <= 0.3) {
      trendPositive += '030';
    } else if (value <= 0.4) {
      trendPositive += '040';
    } else if (value <= 0.5) {
      trendPositive += '050';
    } else if (value <= 0.6) {
      trendPositive += '060';
    } else if (value <= 0.7) {
      trendPositive += '070';
    } else if (value <= 0.8) {
      trendPositive += '080';
    } else if (value <= 0.9) {
      trendPositive += '090';
    } else if (value <= 1 || value > 1) {
      trendPositive += '100';
    }

    resultClasses.push(trendPositive);
  }

  if (value < 0) {
    resultClasses.push(PUSHABLE_CLASS.NEGATIVE);
  } else if (value === 0) {
    resultClasses.push(PUSHABLE_CLASS.NEUTRAL);
  } else {
    resultClasses.push(PUSHABLE_CLASS.POSITIVE);
  }

  return resultClasses;
};

export const formatNumber = globalFormatNumber;

export const selectPushDataFromState = (actualOrPrevious, displayProperty) => pathOr(
  {},
  [actualOrPrevious, displayProperty],
);
export const getMinPrecision = () => pathOr(null, ['precision']);
export const getMaxPrecision = () => pathOr(null, ['precisionMax']);

export const getIdentifierPropertyFromAction = (action) => (
  action && action.identifierProperty ? action.identifierProperty : IDENTIFIER_PROPERTY
);
export const getIdentifierValueFromField = (identifierProperty, field) => (
  field && field.id ? field.id : field[identifierProperty]
);

export const getDefaultDisplayProperty = (field) => {
  if (field) {
    if (field.property) {
      return field.property;
    }
    return path(['pushMetaData', 'defaultDisplayProperty'])(field);
  }
  return null;
};

export const calculateChangePercent = (baseValue, newValue) => {
  const rawBaseValue = parseNumber(baseValue);
  const rawNewValue = parseNumber(newValue);
  if (
    typeof newValue !== 'undefined'
    && typeof baseValue !== 'undefined'
    && newValue !== null
    && baseValue !== null
    && baseValue !== 0
    && !Number.isNaN(parseFloat(rawNewValue))
    && !Number.isNaN(parseFloat(rawBaseValue))
  ) {
    return ((rawNewValue - rawBaseValue) / rawBaseValue) * 100;
  }
  return EMPTY_VALUE;
};

export const getClassByDiffFromPrev = (previous, actual, shouldTick = true) => {
  if (!shouldTick) {
    return null;
  }

  if (previous) {
    const diff = actual - previous;
    if (diff > 0) {
      return PUSHABLE_TICK_CLASS.POSITIVE;
    }
    if (diff === 0) {
      return PUSHABLE_TICK_CLASS.NEUTRAL;
    }
    return PUSHABLE_TICK_CLASS.NEGATIVE;
  }
  return null;
};

export const getChartClassByDiffFromPrev = (previous, actual) => {
  if (previous) {
    const diff = actual - previous;
    if (diff > 0) {
      return PUSHABLE_CHART_TICK_CLASS.POSITIVE;
    }
    if (diff === 0) {
      return PUSHABLE_CHART_TICK_CLASS.NEUTRAL;
    }
    return PUSHABLE_CHART_TICK_CLASS.NEGATIVE;
  }
  return null;
};

export const getResultFromPushData = (
  fieldPushData,
  field,
  displayMode,
  shouldTick = true,
) => {
  const readValueOf = getDefaultDisplayProperty(field);
  const actualPushDataFromState = selectPushDataFromState('act', readValueOf)(fieldPushData);
  const previousPushDataFromState = selectPushDataFromState('prev', readValueOf)(fieldPushData);

  switch (displayMode) {
    case PUSHABLE_DISPLAY_MODE.VALUE: {
      if (readValueOf
        && actualPushDataFromState && actualPushDataFromState.v) {
        return {
          result: formatNumber(
            actualPushDataFromState.v,
            getMinPrecision()(field),
            getMaxPrecision()(field),
          ),
          colorClasses: classNames(
            'tick',
            getClassByDiffFromPrev(
              previousPushDataFromState.v, actualPushDataFromState.v, shouldTick,
            ),
          ),
        };
      }
      break;
    }

    case PUSHABLE_DISPLAY_MODE.COLOR_BAR: {
      if (readValueOf) {
        return {
          colorClasses: classNames(
            getMarketsInstrumentClasses(
              calculateChangePercent(field.baseValue,
                actualPushDataFromState.v ? actualPushDataFromState.v : field.value),
            ),
          ),
        };
      }
      break;
    }

    default: {
      break;
    }
  }
  return {};
};
