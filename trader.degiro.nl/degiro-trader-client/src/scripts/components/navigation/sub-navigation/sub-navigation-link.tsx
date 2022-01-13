import * as React from 'react';
import {NavLink, NavLinkProps} from 'react-router-dom';
import {activeNavigationItem, navigationItem} from './sub-navigation.css';

const SubNavigationLink: React.FunctionComponent<NavLinkProps> = ({className = '', activeClassName = '', ...props}) => (
    <NavLink
        className={`${navigationItem} ${className}`}
        activeClassName={`${activeNavigationItem} ${activeClassName}`}
        {...props}
    />
);

export default React.memo<React.PropsWithChildren<NavLinkProps>>(SubNavigationLink);
