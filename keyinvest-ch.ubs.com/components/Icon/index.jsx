/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'ramda';
import classNames from 'classnames';
import './Icon.scss';

const Icon = (props) => {
  const {
    tag, className, type, onClick,
  } = props;
  const Tag = tag || 'span';
  return Tag && (
    <Tag className={classNames('Icon', className, `icon-${type}`)} {...omit(['className', 'tag', 'type'], props)} onClick={onClick}>
      <span className="path1" />
      <span className="path2" />
      <span className="path3" />
    </Tag>
  );
};

Icon.propTypes = {
  className: PropTypes.string,
  tag: PropTypes.string,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  className: '',
  tag: 'span',
  onClick: () => {},
};

export default React.memo(Icon);
