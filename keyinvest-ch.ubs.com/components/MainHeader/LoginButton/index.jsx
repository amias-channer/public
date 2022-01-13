import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import './LoginButton.scss';
import Icon from '../../Icon';
import { authTogglePopup } from '../../Authentication/actions';
import i18n from '../../../utils/i18n';
import withAuth from '../../Authentication/withAuth';
import { adformTrackEventClick } from '../../../adformTracking/AdformTracking.helper';

export function LoginButtonComponent({ className, dispatch, isUserAuthenticated }) {
  const showAuthPopup = (event) => {
    adformTrackEventClick(
      event,
      'login-click',
    );
    dispatch(authTogglePopup(true));
  };
  return (
    <div className={classNames('LoginButton', 'd-print-none', className)}>
      <Button color="red" onClick={showAuthPopup}>
        {isUserAuthenticated ? <span>{i18n.t('my_account')}</span> : <span>{i18n.t('login')}</span>}
        <Icon type="triangle-down" />
      </Button>
    </div>
  );
}

LoginButtonComponent.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func,
  isUserAuthenticated: PropTypes.bool,
};

LoginButtonComponent.defaultProps = {
  className: '',
  isUserAuthenticated: false,
  dispatch: () => {},
};
const LoginButton = withAuth(connect()(LoginButtonComponent));
export default React.memo(LoginButton);
