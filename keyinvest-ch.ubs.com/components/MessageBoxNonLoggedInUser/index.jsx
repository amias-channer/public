import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import Icon from '../Icon';
import './MessageBoxNonLoggedInUser.scss';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../Button';
import i18n from '../../utils/i18n';
import ButtonsGroup from '../ButtonsGroup';
import { authTogglePopup } from '../Authentication/actions';

const MessageBoxNonLoggedInUser = ({
  title, message, onLoginRegisterButtonClick,
  onCloseMessageButtonClick, history, dispatch, className,
}) => {
  const onLoginRegister = onLoginRegisterButtonClick || (() => {
    dispatch(
      authTogglePopup(true),
    );
  });
  const onCloseClick = onCloseMessageButtonClick || (() => history.goBack());
  return (
    <div className={classNames('MessageBoxNonLoggedInUser mb-3', className)}>
      <Row>
        <Col className="col-auto">
          <Icon type="Information" />
        </Col>
        <Col>
          <div className="title">{title || i18n.t('please_login')}</div>
          <p>{message || i18n.t('my_dashboard_login_required')}</p>
          <ButtonsGroup className="buttons">
            <Button
              onClick={onLoginRegister}
              color={BUTTON_COLOR.ATLANTIC_DARK}
              size={BUTTON_SIZE.MEDIUM}
            >
              {i18n.t('go_to_login_register')}
            </Button>
            <Button
              onClick={onCloseClick}
              color={BUTTON_COLOR.TRANSPARENT}
              size={BUTTON_SIZE.MEDIUM}
            >
              {i18n.t('close_message')}
            </Button>
          </ButtonsGroup>
        </Col>
      </Row>
    </div>
  );
};

MessageBoxNonLoggedInUser.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  className: PropTypes.string,
  onLoginRegisterButtonClick: PropTypes.func,
  onCloseMessageButtonClick: PropTypes.func,
  dispatch: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any),
};
MessageBoxNonLoggedInUser.defaultProps = {
  title: '',
  message: '',
  className: '',
  onLoginRegisterButtonClick: null,
  onCloseMessageButtonClick: null,
  dispatch: () => {},
  history: {
    goBack: () => {},
  },
};
export default connect()(withRouter(MessageBoxNonLoggedInUser));
