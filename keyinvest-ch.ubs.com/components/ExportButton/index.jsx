import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import i18n from '../../utils/i18n';
import Icon from '../Icon';

const ExportButton = ({ className, onClick, type }) => {
  const [disabled, setDisabled] = useState(false);
  const onButtonClick = () => {
    setDisabled(true);
    onClick(type);
  };
  return (
    <Button
      className={classNames('ExportButton', className)}
      color="outline"
      onClick={onButtonClick}
      title={i18n.t(`download_as_${type}`)}
      disabled={disabled}
    >
      <Icon type={type} />
    </Button>
  );
};

ExportButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
};

ExportButton.defaultProps = {
  className: PropTypes.string,
  onClick: () => {},
};

export default React.memo(ExportButton);
