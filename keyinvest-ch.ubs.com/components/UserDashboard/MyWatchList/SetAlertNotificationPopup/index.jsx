import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Row,
} from 'reactstrap';
import Button, { BUTTON_SIZE } from '../../../Button';
import Icon from '../../../Icon';
import './SetAlertNotificationPopup.scss';
import NotificationOptionsForm from './NotificationOptionsForm';
import i18n from '../../../../utils/i18n';
import ButtonsGroup from '../../../ButtonsGroup';

const SetAlertNotificationPopup = ({ data, onTogglePopup }) => {
  const onCloseButtonClicked = () => {
    onTogglePopup(data.productIsin);
  };
  return (
    <Modal isOpen={data.shouldDisplay} wrapClassName="SetAlertNotificationPopup">
      <div className="modal-title">
        <Row>
          <div className="col">
            <Icon type="bell" />
            <h1>Hinweise einrichten</h1>
          </div>
          <div className="col-auto ml-auto">
            <Button className="close-button" color="outline" onClick={onCloseButtonClicked}>
              <Icon type="close" />
            </Button>
          </div>
        </Row>
      </div>
      <Row className="selectable-options">
        <div className="col">
          <h4>Sende mir eine E-Mail wenn:</h4>
          <NotificationOptionsForm />
        </div>
      </Row>
      <Row className="buttons">
        <ButtonsGroup>
          <Button className="apply-button" size={BUTTON_SIZE.STANDARD} type="submit" color="olive">{i18n.t('Apply')}</Button>
          <Button className="cancel-button" size={BUTTON_SIZE.STANDARD} type="reset" color="standard" onClick={onTogglePopup}>{i18n.t('Cancel')}</Button>
        </ButtonsGroup>
      </Row>

      <Row className="disclaimer">
        <div className="col">
          <h5>Disclaimer</h5>
          {/* eslint-disable-next-line max-len */}
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
        </div>
      </Row>
    </Modal>
  );
};

SetAlertNotificationPopup.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onTogglePopup: PropTypes.func,
};

SetAlertNotificationPopup.defaultProps = {
  data: {},
  onTogglePopup: () => {},
};

export default SetAlertNotificationPopup;
