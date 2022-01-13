import React, { createRef } from 'react';
import produce from 'immer';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import LoginForm from '../LoginForm';
import RegisterSection from '../RegisterSection';
import { authTogglePopup } from '../actions';
import './AuthPopup.scss';
import Icon from '../../Icon';
import { MOBILE_MODE, TABLET_MODE } from '../../../utils/responsive';
import ForgotPasswordForm from '../ForgotPasswordForm';
import withAuth from '../withAuth';
import LogoutForm from '../LogoutForm';

export class AuthPopupCmp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toggleAuthPopup = this.toggleAuthPopup.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setShowForgotPasswordForm = this.setShowForgotPasswordForm.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.node = createRef();
    this.scrollbarRef = createRef();
    this.state = {
      showForgotPasswordForm: false,
      email: '',
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  // eslint-disable-next-line react/sort-comp
  setShowForgotPasswordForm(flag, email) {
    this.setState(produce((draft) => {
      draft.showForgotPasswordForm = flag;
      draft.email = email;
    }));
  }

  handleClick(e) {
    const { dispatch } = this.props;
    if (this.node
      && this.node.current
      && this.node.current.contains
      && this.node.current.contains(e.target)) {
      return;
    }
    dispatch(authTogglePopup(false));
  }

  toggleAuthPopup() {
    const { dispatch, showTopAuthPopup } = this.props;
    dispatch(authTogglePopup(!showTopAuthPopup));
  }

  scrollTo(topPositionOfElement) {
    if (this.scrollbarRef && this.scrollbarRef.current) {
      this.scrollbarRef.current.scrollTop(topPositionOfElement);
    }
  }

  render() {
    const { className, isUserAuthenticated } = this.props;
    const { showForgotPasswordForm, email } = this.state;
    return (
      <div className={classNames('AuthPopup container p-0', className)} ref={this.node}>
        <div className="popup-container">
          <Scrollbars
            autoHeight
            autoHeightMin={100}
            autoHeightMax="calc(100vh - 100px)"
            ref={this.scrollbarRef}
          >
            <div className="inner-container">
              <Button className="close-button" color="outline" onClick={this.toggleAuthPopup}>
                <Icon type="close" />
              </Button>
              {!isUserAuthenticated ? (
                <>
                  {!showForgotPasswordForm && (
                    <>
                      <LoginForm setShowForgotPasswordForm={this.setShowForgotPasswordForm} />
                      <hr />
                      <RegisterSection scrollToFunc={this.scrollTo} />
                    </>
                  )}
                  {showForgotPasswordForm && (
                    <ForgotPasswordForm
                      setShowForgotPasswordForm={this.setShowForgotPasswordForm}
                      email={email}
                    />
                  )}
                </>
              ) : (
                <LogoutForm />
              )}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

AuthPopupCmp.propTypes = {
  className: PropTypes.string,
  showTopAuthPopup: PropTypes.bool,
  isUserAuthenticated: PropTypes.bool,
  dispatch: PropTypes.func,
};

AuthPopupCmp.defaultProps = {
  className: '',
  showTopAuthPopup: false,
  isUserAuthenticated: false,
  dispatch: () => {},
};

const mapStateToProps = (state) => ({
  showTopAuthPopup: state.auth.showTopAuthPopup,
  smallMode: (
    state.global.responsiveMode === MOBILE_MODE || state.global.responsiveMode === TABLET_MODE
  ),
});

const AuthPopup = withAuth(connect(mapStateToProps)(AuthPopupCmp));
export default AuthPopup;
