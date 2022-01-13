import React from 'react';
import { path } from 'ramda';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  isUserAuthenticated: path(['auth', 'isUserAuthenticated'], state),
  userProfile: path(['auth', 'userProfile'], state),
});

function withAuth(WrappedComponent) {
  return React.memo(connect(mapStateToProps)(
    class extends React.PureComponent {
      render() {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <WrappedComponent {...this.props} />;
      }
    },
  ));
}

export default withAuth;
