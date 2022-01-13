import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { goBack } from 'connected-react-router';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../Button';
import i18n from '../../utils/i18n';
import ButtonsGroup from '../ButtonsGroup';

const GenericErrorMessageCmp = ({ className, message, dispatch }) => {
  const goBackClick = () => dispatch(goBack());
  return (
    <div className={classNames('GenericErrorMessage', className)}>
      <Alert color="danger">
        <div className="row">
          <div className="col-lg">
            {message || i18n.t('error_message_technical_problem')}
          </div>
          <div className="col-lg-auto">
            <ButtonsGroup>
              <Button
                color={BUTTON_COLOR.STANDARD}
                size={BUTTON_SIZE.STANDARD}
                onClick={goBackClick}
              >
                {i18n.t('go_back')}
              </Button>
            </ButtonsGroup>
          </div>
        </div>
      </Alert>
    </div>
  );
};

GenericErrorMessageCmp.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  dispatch: PropTypes.func,
};
GenericErrorMessageCmp.defaultProps = {
  className: '',
  message: null,
  dispatch: () => {},
};
const GenericErrorMessage = React.memo(connect()(GenericErrorMessageCmp));
export default GenericErrorMessage;
