import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PUSHABLE_DISPLAY_MODE } from '../PushableDefault.helper';
import DefaultValuePresenter from '../DefaultValuePresenter';
import {
  pushTickManagerSetShouldTickForField,
} from './actions';

/**
 * Component to keep track
 * of push ticks (green blink if positive change or red if negative change in UI)
 * for pushable fields
 */
class PushTickManager extends React.PureComponent {
  componentDidMount() {
    const {
      field, dispatch,
    } = this.props;
    if (field) {
      dispatch(pushTickManagerSetShouldTickForField(field.id, false));
    }
  }

  render() {
    const {
      field, className, displayMode, fieldPushData, children, displayCurrency, shouldTick,
    } = this.props;
    return (
      <DefaultValuePresenter
        field={field}
        fieldPushData={fieldPushData}
        displayMode={displayMode}
        className={className}
        displayCurrency={displayCurrency}
        shouldTick={shouldTick}
      >
        {children}
      </DefaultValuePresenter>
    );
  }
}

PushTickManager.propTypes = {
  field: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  displayMode: PropTypes.string,
  displayCurrency: PropTypes.bool,
  fieldPushData: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
  shouldTick: PropTypes.bool,
  dispatch: PropTypes.func,
};

PushTickManager.defaultProps = {
  field: {},
  displayCurrency: false,
  className: '',
  displayMode: PUSHABLE_DISPLAY_MODE.VALUE,
  fieldPushData: {},
  children: undefined,
  shouldTick: true,
  dispatch: () => {},
};

const mapStateToProps = (state, ownProps) => ({
  shouldTick: state
    && ownProps.field
    && ownProps.field.id
    && state.pushTickManager[ownProps.field.id],
});
const PushTickManagerConnected = connect(mapStateToProps)(PushTickManager);
export default PushTickManagerConnected;
