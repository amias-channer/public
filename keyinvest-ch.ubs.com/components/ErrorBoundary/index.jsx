import React from 'react';
import { produce } from 'immer';
import PropTypes from 'prop-types';
import Logger from '../../utils/logger';
import GenericErrorMessage from '../GenericErrorMessage';

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Something happened to one of my children.
    // Add error to state
    Logger.error('ErrorBoundary', 'componentDidCatch', error, info);
    this.setState(produce((draft) => {
      draft.error = error;
      draft.info = info;
    }));
    // const { dispatch } = this.props;
    // dispatch(globalErrorOccurred(error, info));
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div className="container main-container">
          <GenericErrorMessage />
        </div>
      );
    }

    const { children } = this.props;
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
};
ErrorBoundary.defaultProps = {
  children: null,
};
export default ErrorBoundary;
