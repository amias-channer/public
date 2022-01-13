import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Notification.scss';
import HtmlText from '../../HtmlText';
import Icon from '../../Icon';

const NotificationCmp = ({
  className, type, content,
}) => (content && (
  <div className={classNames('Notification', className)}>
    <div className={type}>
      <Icon tag="i" type={type} />
      <span><HtmlText data={{ text: content }} /></span>
    </div>
  </div>
));
NotificationCmp.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  content: PropTypes.string,
};
NotificationCmp.defaultProps = {
  className: '',
  type: 'warning',
  content: null,
};

const Notification = React.memo(NotificationCmp);
export default Notification;
