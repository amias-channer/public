import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './QuickSearch.scss';
import { connect } from 'react-redux';
import { produce } from 'immer';
import { pathOr } from 'ramda';
import QuickSearchDropdown from './QuickSearchDropdown';
import QuickSearchTextInputs from './QuickSearchTextInputs';
import QuickSearchLinks from './QuickSearchLinks';
import Logger from '../../utils/logger';
import {
  quickSearchComponentDidUnmount,
  quickSearchOnDropdownChange,
  quickSearchSetInitialData,
  quickSearchUpdateProductTypeUrls,
  quickSearchUpdateResetProductTypeUrls,
} from './actions';
import {
  dispatchAnalyticsQuickSearchTrack,
} from '../../analytics/Analytics.helper';
import { isEmptyString, parseNumber } from '../../utils/utils';
import {
  getHeading,
  getInnerTextFromEvent,
  getSelectedUnderlying, getShowHeadingSettings,
  getValueFromEvent, shouldDisplayHeading,
} from './QuickSearch.helper';
import { pathOrString } from '../../utils/typeChecker';
import { DESKTOP_MODE } from '../../utils/responsive';

const INPUT_NAME_STRIKE = 'strike';
const INPUT_NAME_LEVERAGE = 'leverage';
const INPUTS_INITIAL_VALUES_STATE = { [INPUT_NAME_STRIKE]: '', [INPUT_NAME_LEVERAGE]: '' };
const INPUTS_INITIAL_DISABLED_STATE = { [INPUT_NAME_STRIKE]: false, [INPUT_NAME_LEVERAGE]: false };

const DEFAULT_ACTIVE_INPUT_STATE = null;

export class QuickSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      textInputsValues: INPUTS_INITIAL_VALUES_STATE,
      textInputsDisabledStatus: INPUTS_INITIAL_DISABLED_STATE,
      activeInputName: DEFAULT_ACTIVE_INPUT_STATE,
    };
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onTextInputChange = this.onTextInputChange.bind(this);
    this.onTextInputClick = this.onTextInputClick.bind(this);
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onQuickSearchLinkClicked = this.onQuickSearchLinkClicked.bind(this);
    const { dispatch, data, uniqId } = props;
    dispatch(quickSearchSetInitialData(uniqId, data));
  }

  componentWillUnmount() {
    const { dispatch, uniqId } = this.props;
    dispatch(quickSearchComponentDidUnmount(uniqId));
  }

  onItemSelect(e) {
    const { data, dispatch, uniqId } = this.props;
    const selectedItemText = getInnerTextFromEvent(e);
    const selectedUnderlyingLabel = getSelectedUnderlying(data);
    if (selectedItemText === selectedUnderlyingLabel) {
      return;
    }
    dispatch(quickSearchOnDropdownChange(uniqId, {
      quickSearchUrl: data.quickSearchUrl,
    }, {
      label: selectedItemText,
      sin: getValueFromEvent(e),
    }));
  }

  onQuickSearchLinkClicked(linkLabel) {
    const { data } = this.props;
    const { textInputsValues } = this.state;

    try {
      const analyticsSearchUnderlying = `${data.underlying.selected.label}:${parseNumber(data.value.value)}`;

      let analyticsSearchFilterSelected = '';
      if (textInputsValues[INPUT_NAME_STRIKE]) {
        analyticsSearchFilterSelected = 'Basispreis';
      } else if (textInputsValues[INPUT_NAME_LEVERAGE]) {
        analyticsSearchFilterSelected = 'Hebel';
      }

      let analyticsValueEntered = '';
      if (analyticsSearchFilterSelected) {
        analyticsValueEntered = `${analyticsSearchFilterSelected}:${textInputsValues[INPUT_NAME_STRIKE] ? textInputsValues[INPUT_NAME_STRIKE] : textInputsValues[INPUT_NAME_LEVERAGE]}`;
      }

      dispatchAnalyticsQuickSearchTrack(
        analyticsSearchUnderlying,
        analyticsSearchFilterSelected,
        analyticsValueEntered,
        linkLabel,
      );
    } catch (e) {
      Logger.warn('QuickSearch::onQuickSearchLinkClicked analytics', e);
    }
  }

  onTextInputChange(e) {
    const { textInputsValues } = this.state;
    const { dispatch, uniqId } = this.props;
    const inputName = e.target.name;
    const updatedInputValue = e.target.value;
    const inputsValues = { ...textInputsValues };
    inputsValues[inputName] = updatedInputValue;

    this.setState(produce((draft) => {
      draft.textInputsValues = inputsValues;
    }), () => {
      dispatch(quickSearchUpdateProductTypeUrls(uniqId, inputName, updatedInputValue));
    });
  }

  onTextInputClick(e) {
    if (pathOr(false, ['target', 'name'], e) !== false) {
      const inputName = e.target.name;
      const { activeInputName } = this.state;
      const { dispatch, uniqId } = this.props;

      if (inputName === activeInputName) {
        return;
      }

      this.setState(produce((draft) => {
        draft.textInputsDisabledStatus = INPUTS_INITIAL_DISABLED_STATE;
        draft.activeInputName = inputName;
      }));

      const inputsDisabledState = { ...INPUTS_INITIAL_DISABLED_STATE };
      const inputsValues = { ...INPUTS_INITIAL_VALUES_STATE };

      if (inputName === INPUT_NAME_STRIKE) {
        inputsDisabledState[INPUT_NAME_LEVERAGE] = true;
        inputsValues[INPUT_NAME_LEVERAGE] = '';
      } else if (inputName === INPUT_NAME_LEVERAGE) {
        inputsDisabledState[INPUT_NAME_STRIKE] = true;
        inputsValues[INPUT_NAME_STRIKE] = '';
      }

      this.setState(produce((draft) => {
        draft.textInputsValues = inputsValues;
        draft.textInputsDisabledStatus = inputsDisabledState;
      }), () => {
        dispatch(quickSearchUpdateResetProductTypeUrls(uniqId));
      });
    }
  }

  onTextInputBlur() {
    const { textInputsValues } = this.state;
    if (isEmptyString(textInputsValues[INPUT_NAME_STRIKE])
      && isEmptyString(textInputsValues[INPUT_NAME_LEVERAGE])) {
      this.setState(produce((draft) => {
        draft.activeInputName = DEFAULT_ACTIVE_INPUT_STATE;
      }));
    }
  }

  render() {
    const {
      className, data, isLoading, responsiveMode,
    } = this.props;
    const { textInputsValues, textInputsDisabledStatus, activeInputName } = this.state;
    const heading = getHeading(data);
    const showHeadingSettings = getShowHeadingSettings(data);
    return (
      <div className={classNames('QuickSearch', className, heading ? 'with-heading' : '')}>
        {data && Object.keys(data).length && (
          <>
            {heading
            && shouldDisplayHeading(responsiveMode, showHeadingSettings)
            && (<h1>{heading}</h1>)}
            <QuickSearchDropdown
              field={data.value}
              list={data.underlying.list}
              selectedDropdownItem={data.underlying.selected.label}
              onItemSelect={this.onItemSelect}
              isLoading={isLoading}
            />
            <QuickSearchTextInputs
              onTextInputChange={this.onTextInputChange}
              onInputClick={this.onTextInputClick}
              onTextInputBlur={this.onTextInputBlur}
              textInputsValues={textInputsValues}
              textInputsDisabledStatus={textInputsDisabledStatus}
            />
            <QuickSearchLinks
              data={data.productTypes}
              activeInputName={activeInputName}
              onQuickSearchLinkClicked={this.onQuickSearchLinkClicked}
            />
          </>
        )}
      </div>
    );
  }
}

QuickSearch.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  dispatch: PropTypes.func.isRequired,
  uniqId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  responsiveMode: PropTypes.string,
};

QuickSearch.defaultProps = {
  className: '',
  isLoading: false,
  responsiveMode: DESKTOP_MODE,
};

const mapStateToProps = (state, ownProps) => ({
  data: state.quickTurboSearch[ownProps.uniqId]
     && state.quickTurboSearch[ownProps.uniqId].data ? state.quickTurboSearch[
      ownProps.uniqId
    ].data : ownProps.data,
  isLoading: state.quickTurboSearch[ownProps.uniqId]
    && state.quickTurboSearch[ownProps.uniqId].isLoading,
  responsiveMode: pathOrString(DESKTOP_MODE, ['global', 'responsiveMode'], state),
});
export default connect(mapStateToProps)(QuickSearch);
