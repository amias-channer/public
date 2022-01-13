import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TextInput from '../../TextInput';
import i18n from '../../../utils/i18n';
import { notEmptyString } from '../../../utils/utils';

function QuickSearchTextInputs(props) {
  const {
    onTextInputChange, onInputClick, onTextInputBlur, textInputsValues, textInputsDisabledStatus,
  } = props;
  const { className } = props;
  return (
    <div className={classNames('QuickSearchTextInputs', className)}>
      <div className="selections">
        <div className="bottom-section">
          <div>
            <h3>{i18n.t('select_base_price_or_leverage_optional')}</h3>
            <div className="text-inputs">
              <div className="row">
                <div className="col">
                  <TextInput
                    id="strike"
                    name="strike"
                    onChange={onTextInputChange}
                    placeholder={i18n.t('Base Price')}
                    title={i18n.t('Base Price')}
                    onClick={onInputClick}
                    isDisabled={textInputsDisabledStatus.strike}
                    value={textInputsValues.strike}
                    type="number"
                    displayOutline={notEmptyString(textInputsValues.strike)}
                    min={0}
                    onBlur={onTextInputBlur}
                  />
                </div>
                <div className="col-auto separator">
                  <span>{i18n.t('or')}</span>
                </div>
                <div className="col">
                  <TextInput
                    id="leverage"
                    name="leverage"
                    onChange={onTextInputChange}
                    placeholder={i18n.t('hebel')}
                    title={i18n.t('hebel')}
                    onClick={onInputClick}
                    isDisabled={textInputsDisabledStatus.leverage}
                    value={textInputsValues.leverage}
                    type="number"
                    displayOutline={notEmptyString(textInputsValues.leverage)}
                    min={0}
                    onBlur={onTextInputBlur}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

QuickSearchTextInputs.propTypes = {
  className: PropTypes.string,
  textInputsValues: PropTypes.objectOf(PropTypes.any),
  textInputsDisabledStatus: PropTypes.objectOf(PropTypes.any),
  onTextInputChange: PropTypes.func,
  onInputClick: PropTypes.func,
  onTextInputBlur: PropTypes.func,
};

QuickSearchTextInputs.defaultProps = {
  className: '',
  textInputsValues: {},
  textInputsDisabledStatus: {},
  onTextInputChange: () => {},
  onInputClick: () => {},
  onTextInputBlur: () => {},
};

export default QuickSearchTextInputs;
