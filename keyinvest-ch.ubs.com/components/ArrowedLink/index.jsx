import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './ArrowedLink.scss';

const ArrowedLink = ({
  url, label, className, onClick, isNavLink,
}) => {
  const onLinkClicked = (e) => onClick(e, url, label);
  if (isNavLink) {
    return (
      <NavLink
        className={classNames('ArrowedLink', className)}
        to={url}
        onClick={onLinkClicked}
      >
        <i className="icon-arrow_02_forward link-icon" />
        &nbsp;
        {label || url}
      </NavLink>
    );
  }

  return (
    <a
      className={classNames('ArrowedLink', className)}
      href={url}
      onClick={onLinkClicked}
    >
      <i className="icon-arrow_02_forward link-icon" />
      &nbsp;
      {label || url}
    </a>
  );
};

ArrowedLink.propTypes = {
  url: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  isNavLink: PropTypes.bool,
};
ArrowedLink.defaultProps = {
  url: '#',
  label: null,
  className: '',
  onClick: () => {},
  isNavLink: false,
};
export default React.memo(ArrowedLink);
