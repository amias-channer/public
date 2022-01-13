import {
  descend, prop, remove, sortWith,
} from 'ramda';
import classNames from 'classnames';
import { pathOrArray } from '../../../../utils/typeChecker';
import {
  calculateChangePercent,
  EMPTY_VALUE,
  formatNumber,
  getDefaultDisplayProperty,
  getMarketsInstrumentClasses,
  selectPushDataFromState,
} from '../../../PushManager/PushableDefault/PushableDefault.helper';
import { calculateBarWidth } from '../../../PushManager/PushablePercentWithBar/PushablePercentWithBar.helper';

export const tableDataHasRows = (data) => pathOrArray([], ['rows'], data).length > 0;

export const getPushDataByValor = (valor, pushData) => valor && pushData && pushData[valor];

export const getUpdatedPushValue = (valor, field, pushData) => {
  const pushDataForInstrument = getPushDataByValor(valor, pushData);
  if (pushDataForInstrument) {
    const readValueOf = getDefaultDisplayProperty(field);
    const actualPushDataFromState = selectPushDataFromState('act', readValueOf)(pushDataForInstrument);
    return actualPushDataFromState.v;
  }
  return field.value;
};

export const calculateChange2PreviousClosePercentForRows = (
  tableRows,
  pushData,
) => {
  const tableRowsWithChange2PrevClosePercent = [];
  tableRows.forEach((row, index) => {
    const changePercent = !row.price ? EMPTY_VALUE : calculateChangePercent(
      row.price.baseValue,
      getUpdatedPushValue(row.valor, row.price, pushData),
    );
    tableRowsWithChange2PrevClosePercent[index] = {
      ...row,
      calculatedChange2PreviousClosePercent: changePercent,
    };
  });
  return tableRowsWithChange2PrevClosePercent;
};

export const sortRowsByChange2PreviousCloseDesc = (rows) => sortWith([
  descend(prop('calculatedChange2PreviousClosePercent')),
])(rows);

export const sortTableRowsBasedOnChange2PreviousClosePercent = (
  tableRows,
  isFirstRowSticky,
) => {
  if (isFirstRowSticky) {
    const [firstRow] = tableRows;
    const trimmedRows = remove(0, 1, tableRows);
    return [firstRow, ...sortRowsByChange2PreviousCloseDesc(trimmedRows)];
  }
  return sortRowsByChange2PreviousCloseDesc(tableRows);
};

export const getPercentBarWithDataForCalculatedChange = (
  calculatedChange,
  maxForPercentCalc,
) => {
  const formattedPercent = formatNumber(calculatedChange, 2, 2);
  const barWidth = calculateBarWidth(calculatedChange, maxForPercentCalc);
  return {
    barWidth: formattedPercent !== EMPTY_VALUE ? barWidth : 0,
    result: formattedPercent !== EMPTY_VALUE ? `${formattedPercent}%` : EMPTY_VALUE,
    colorClasses: classNames(
      getMarketsInstrumentClasses(calculatedChange),
    ),
  };
};

export const getLastChangeField = (
  instrument,
) => ({ valor: instrument.valor, ...instrument.lastChange });

export const getAbsoluteField = (instrument) => ({
  ...instrument.price,
  value: instrument.change2PreviousClose,
  valor: instrument.valor,
});

export const getPercentField = (instrument) => ({
  ...instrument.price,
  valor: instrument.valor,
});
