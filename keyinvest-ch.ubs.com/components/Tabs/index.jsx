import React, { useState } from 'react';
import classNames from 'classnames';
import {
  Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import './Tabs.scss';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import mediaQueries from '../../utils/mediaQueries';

function Tabs(props) {
  const {
    links, children, className, onTabLinkClick, activeTabLink,
  } = props;
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropDownOpen(dropDownOpen === false);
  };
  const tabButtons = (
    <>
      <MediaQuery query={mediaQueries.mobileTabletOnly}>
        <Dropdown isOpen={dropDownOpen} toggle={toggleDropdown}>
          <DropdownToggle caret>
            <span>{ activeTabLink }</span>
          </DropdownToggle>
          <DropdownMenu>
            { links && links.map((linkText) => (
              <DropdownItem
                className={activeTabLink === linkText ? 'active' : ''}
                onClick={onTabLinkClick}
                key={linkText}
              >
                {linkText}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </MediaQuery>

      <MediaQuery query={mediaQueries.notebook}>
        { links && links.map((linkText) => (
          <Button
            onClick={onTabLinkClick}
            className={activeTabLink === linkText ? 'active' : ''}
            key={linkText}
          >
            {linkText}
          </Button>
        ))}
      </MediaQuery>
    </>
  );
  return (
    <div className={classNames('Tabs', className)}>
      <div className="btn-wrapper">{tabButtons}</div>
      {children}
    </div>
  );
}

Tabs.propTypes = {
  links: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
  className: PropTypes.string,
  onTabLinkClick: PropTypes.func,
  activeTabLink: PropTypes.string,
};

Tabs.defaultProps = {
  links: [],
  children: [],
  className: '',
  onTabLinkClick: () => {},
  activeTabLink: '',
};
export default Tabs;
