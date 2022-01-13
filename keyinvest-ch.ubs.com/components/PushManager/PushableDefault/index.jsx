import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pushManagerAddSubscription, pushManagerRemoveSubscription } from '../actions';
import './PushableDefault.scss';
import {
  PUSHABLE_DISPLAY_MODE,
  IDENTIFIER_PROPERTY,
} from './PushableDefault.helper';
import DefaultValuePresenter from './DefaultValuePresenter';

export class PushableDefaultComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.subscribePushable();
  }

  componentDidUpdate(prevProps) {
    const { field, dispatch } = this.props;
    if (
      field
      && prevProps.field
      && prevProps.field[IDENTIFIER_PROPERTY] !== field[IDENTIFIER_PROPERTY]
    ) {
      dispatch(pushManagerRemoveSubscription(prevProps.field));
      dispatch(pushManagerAddSubscription(field));
    }
  }

  componentWillUnmount() {
    this.unsubscribePushable();
  }

  subscribePushable() {
    const { field, identifierProperty } = this.props;
    if (field && field.pushMetaData) {
      const { dispatch } = this.props;
      dispatch(pushManagerAddSubscription(field, identifierProperty));
    }
  }

  unsubscribePushable() {
    const { field, identifierProperty } = this.props;
    if (field && field.pushMetaData) {
      const { dispatch } = this.props;
      dispatch(pushManagerRemoveSubscription(field, identifierProperty));
    }
  }

  render() {
    const {
      field, className, displayMode, fieldPushData, children, displayCurrency,
    } = this.props;
    return (
      <DefaultValuePresenter
        field={field}
        className={className}
        displayMode={displayMode}
        fieldPushData={fieldPushData}
        displayCurrency={displayCurrency}
      >
        {children}
      </DefaultValuePresenter>
    );
  }
}

PushableDefaultComponent.propTypes = {
  dispatch: PropTypes.func,
  field: PropTypes.objectOf(PropTypes.any),
  identifierProperty: PropTypes.string,
  className: PropTypes.string,
  displayMode: PropTypes.string,
  displayCurrency: PropTypes.bool,
  fieldPushData: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
};
const EMPTY_FIELD_PUSH_DATA = {
  fieldPushData: {},
};
PushableDefaultComponent.defaultProps = {
  dispatch: null,
  field: {},
  displayCurrency: false,
  identifierProperty: undefined,
  className: '',
  displayMode: PUSHABLE_DISPLAY_MODE.VALUE,
  fieldPushData: {},
  children: undefined,
};

export const pushableMapStateToProps = (state, ownProps) => {
  if (ownProps.field) {
    const id = ownProps.field.id ? ownProps.field.id : ownProps.identifierProperty;
    if (state.pushManager && state.pushManager.pushData) {
      return {
        fieldPushData: state.pushManager.pushData[id],
      };
    }
  }
  return EMPTY_FIELD_PUSH_DATA;
};

const PushableDefault = connect(pushableMapStateToProps)(PushableDefaultComponent);
export default PushableDefault;
